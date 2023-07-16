import { ethers } from "./ethers-min.js"
import { abi, contractAddress } from "./constants/constants.js"

const connectButton = document.getElementById("btn")
const onlyFundsButton = document.getElementById("btn2")
const getBalanceButton = document.getElementById("btn3");
const withdrawButton = document.getElementById("btn4");

connectButton.onclick = connect;
onlyFundsButton.onclick = fund;
getBalanceButton.onclick = getBalance;
withdrawButton.onclick = withdrawFunds;

async function connect() {
    if (typeof window.ethereum !== undefined) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("Metamask is present and connected ");
            connectButton.innerHTML = "Connected !";
            // const accounts = await ethereum.request({ method: "eth_accounts" })
            // console.log(accounts)
        } catch (err) {
            console.log(err);
        }

    } else {
        connectButton.innerHTML = "Connect Wallet";
    }
}

async function fund() {
    const ethAmount = document.getElementById("amt").value;
    if (typeof window.ethereum !== undefined) {
        console.log(`Funding with ${ethAmount}`);
        // provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // signer : returns whichever the wallet is connected to the contract
        const signer = provider.getSigner()
        // console.log(signer);

        // contract to interact
        // ABI & Address of contract
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount) });
            // listen for an event or transaction to be mined
            await listenForResponse(transactionResponse, provider);
            console.log("Done");
        }
        catch (e) {
            console.log(e);
        }
    }
}

async function getBalance() {
    if (typeof window.ethereum !== undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        const balanceInFund = ethers.utils.formatEther(balance);
        getBalanceButton.innerHTML = balanceInFund;
        console.log(balanceInFund);
    }
}

async function withdrawFunds() {
    console.log("Withdrawing...");
    if (typeof window.ethereum !== undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
            const transactionResponse = await contract.withdraw();
            await listenForResponse(transactionResponse, provider);
        }
        catch (e) {
            console.log(e);
        }
    }
}

function listenForResponse(transactionResponse, provider) {
    console.log(`Mining Transaction ${transactionResponse.hash}`);

    return new Promise((resolve, reject) => {

        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations.`);
            resolve();
        })
    })
}
