# Infinite Market Smart Contract

A dezetralized online market place on Antelope blockchains.

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

On Docker 4.26.1 you find the settings by double clicking the Docker icon in the task bar. Select "Builds" and the button "Builder setings" in the right upper corner.

Enable Debian in the settings at "Resources"/"WSL integration" and confirm it by clicking the button "Apply & restart". 

Do not forget also to restart the Debian consol. 

## Run tests

Docker must be running. Start the tests with the following command in the debian console

```sh
sudo yarn test
```