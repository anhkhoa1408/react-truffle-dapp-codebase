import React, { useCallback, useEffect, useReducer } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { actions, initialState, reducer } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initBlockchain = useCallback(async (artifact) => {
    if (artifact) {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const accounts = await web3.eth.getAccounts();
      const networkID = await web3.eth.net.getId();
      const { abi } = artifact;
      let address, contract;
      try {
        address = artifact.networks[networkID].address;
        contract = new web3.eth.Contract(abi, address);
      } catch (err) {
        console.error(err);
      }
      dispatch({
        type: actions.init,
        data: { artifact, web3, accounts, networkID, contract },
      });
    }
  }, []);

  useEffect(() => {
    const tryInitBlockchain = async () => {
      try {
        const artifact = require("../../contracts/SimpleStorage.json");
        initBlockchain(artifact);
      } catch (err) {
        console.error("err", err);
      }
    };

    tryInitBlockchain();
  }, [initBlockchain]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];

    const handleChange = () => {
      initBlockchain(state.artifact);
    };

    events.forEach((e) => window.ethereum.on(e, handleChange));

    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, handleChange));
    };
  }, [initBlockchain, state.artifact]);

  return (
    <EthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
