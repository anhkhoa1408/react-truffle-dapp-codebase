import React, { useEffect, useState } from "react";
import { Button, FormGroup, Input, Label, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import Web3 from "web3";
import { useEth } from "../../contexts/EthContext";
import { createHelia } from "helia";
import { createUnixFs } from "@helia/unixfs";

const FormReact = () => {
  const { state } = useEth();

  const [active, setActive] = useState(1);
  const [accounts, setAccounts] = useState([]);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);

  // FOR IPFS
  const [ipfs, setIpfs] = useState(null);

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

  const [file, setFile] = useState(0);
  const onUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToIpfs = async () => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const buffer = Buffer.from(file);

      const ipfsData = {};
    };
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
        <NavItem onClick={() => setActive(3)}>
          <NavLink className={`cursor-pointer ${active === 3 ? "active" : ""}`}>IPFS Uploader</NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId={1}>
          <FormGroup>
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
          <FormGroup>
            <Label>Balance</Label>
            <Input disabled value={`${balance} ETH`} />
          </FormGroup>
        </TabPane>
        <TabPane tabId={2}>
          <FormGroup>
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
          <FormGroup>
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
          <Button color="primary" onClick={transferToAddress}>
            Transfer
          </Button>
        </TabPane>
        <TabPane tabId={3}>
          <FormGroup>
            <Label>Upload</Label>
            <Input type="file" onChange={onUpload}></Input>
          </FormGroup>
          <Button color="primary" onClick={transferToAddress}>
            Upload
          </Button>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default FormReact;
