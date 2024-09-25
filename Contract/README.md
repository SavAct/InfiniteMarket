# Infinite Market Smart Contract

A decentralized online market place on Antelope blockchains.

This is the smart contract for the following interface:
https://github.com/SavAct/SavWeb-Pages/tree/main/Shop

# Guid to run the test suite also on windows

You need to activate the windows feature Hyper-V, but it is not available on Windows 10 Home. You might need to upgrade your Windows to Windows Pro.

## Activate WSL 2

Start windows PowerShell as administrator and run the following commands

```sh
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

```sh
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

```sh
wsl --set-default-version 2
```

## Setup Linux environment

Install Debian from Microsoft store, start it, create your user account and run the following commands

```sh
sudo apt-get update
```

```sh
sudo apt-get upgrade
```

For yarn installation via npm

```sh
sudo apt-get install npm
```

Install yarn globally

```sh
sudo npm install --global yarn
```

Navigate in the console to the folder teleporteos in which you can install the modules (**run the following command again if it fails**)

```sh
sudo yarn install
```

## Set up Docker

Install and start Docker, check for updates and install them. 

On Docker 4.26.1 you find the settings by double clicking the Docker icon in the task bar. Select "Builds" and the button "Builder settings" in the right upper corner.

Enable Debian in the settings at "Resources"/"WSL integration" and confirm it by clicking the button "Apply & restart". 

Do not forget also to restart the Debian consol. 

## Run tests

Docker must be running. Start the tests with the following command in the debian console

```sh
yarn test
```

## Link a SavWeb page

You can use the contract account name as SavWeb domain by using the following contract action. 
1. Upload the page to the blockchain with a [SavWeb upload contract](https://github.com/SavAct/SavWeb?tab=readme-ov-file#file-upload).
2. Use the parameters of your upload as parameters for the following action on the market contract. 

```cpp
ACTION setpage(0, vector<Ref>& refs, "", "index.html")

/**
 * Ref type is a reference to a transaction on the blockchain composed of the block number and transaction id
*/
struct Ref{
    uint64_t Block;
    checksum256 TrxId;
};
```

Note: If you uploaded the whole page with one transaction the `refs` array will hold only one entry `ref[0]` to the first transaction. If you split the upload to several transactions, there will be a second entry `ref[1]` that points to the last transaction. You will find the correct `refs` array after successfully uploading your page with your [SavWeb upload contract](https://github.com/SavAct/SavWeb?tab=readme-ov-file#file-upload) on blockchain at the the [upload contract table](https://github.com/SavAct/SavWeb/blob/main/Smart%20Contract/site/include/tables.hpp#L18).