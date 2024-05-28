import React, { useEffect, useState } from "react";
import { Button, FormGroup, Input, Label, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import Web3 from "web3";
import { useEth } from "../../contexts/EthContext";

const FormReact = () => {
  const { state } = useEth();

  const [active, setActive] = useState(1);
  const [accounts, setAccounts] = useState([]);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);

  const [transferData, setTransferData] = useState({
    to: "",
    amount: 0,
  });

  useEffect(() => {
    async function getETHAccount() {
      const accounts = await state.web3.eth.getAccounts();
      setAccounts(accounts);
    }

    if (state?.web3) {
      getETHAccount();
    }
  }, [state]);

  useEffect(() => {
    async function getAccountBalance(address) {
      setBalance(Web3.utils.fromWei(await state.web3.eth.getBalance(address), "ether"));
    }

    if (address && state?.web3) {
      getAccountBalance(address);
    }
  }, [address, state?.web3]);

  const transferToAddress = async () => {
    const tx = {
      from: state.accounts[0],
      to: transferData.to,
      value: Web3.utils.toWei(transferData.amount, "ether"),
      gas: 6721975,
      gasPrice: 20000000000,
    };
    const transaction = await state.web3.eth.sendTransaction(tx);
    alert(`Transaction hash is: ${transaction.transactionHash}`);
  };

  return (
    <div className="container px-5 min-vh-100 m-auto d-flex flex-column justify-content-center">
      <Nav fill pills className="mb-2">
        <NavItem onClick={() => setActive(1)}>
          <NavLink className={`cursor-pointer ${active === 1 ? "active" : ""}`}>Balance</NavLink>
        </NavItem>
        <NavItem onClick={() => setActive(2)}>
          <NavLink className={`cursor-pointer ${active === 2 ? "active" : ""}`}>Transfer</NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId={1}>
          <FormGroup className="input-group-lg">
            <Label>Address</Label>
            <Input onChange={(e) => setAddress(e.target.value)} type="select">
              <option selected defaultValue disabled>
                Select address
              </option>
              {accounts?.map((account) => (
                <option key={account}>{account}</option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup className="input-group-lg">
            <Label>Balance</Label>
            <Input disabled value={`${balance} ETH`} />
          </FormGroup>
        </TabPane>
        <TabPane tabId={2}>
          <FormGroup className="input-group-lg">
            <Label>To address</Label>
            <Input
              onChange={(e) =>
                setTransferData({
                  ...transferData,
                  to: e.target.value,
                })
              }
              type="select"
            >
              <option selected defaultValue disabled>
                Select address
              </option>
              {accounts
                ?.filter((acc) => acc !== accounts[0])
                ?.map((account) => (
                  <option key={account}>{account}</option>
                ))}
            </Input>
          </FormGroup>
          <FormGroup className="input-group-lg">
            <Label>Amount</Label>
            <Input
              onChange={(e) =>
                setTransferData({
                  ...transferData,
                  amount: e.target.value,
                })
              }
              type="number"
            />
          </FormGroup>
          <Button color="primary" size="lg" onClick={transferToAddress}>
            Transfer
          </Button>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default FormReact;
