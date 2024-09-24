# SavAct Marketplace GUI

An online marketplace for physical goods that needs no central authority.
It relies on the SavAct fraud protection mechanism. For the communication between sellers and customers PGP encryption is implemented.

## Installation

1. [Node](https://nodejs.org) need to be installed.
2. Use `yarn` or `npm` to install the install dependencies.

```bash
yarn install
```

```bash
npm install
```

## Usage

Transpile the code to a single html file: `dist/index.html`

```bash
yarn build
```

Developing mode for instant code change update **without** SavAct browser specific functionality

```bash
yarn dev
```

Transpile the code to a single html file and show it in the SavAct browser

```bash
yarn preview
```

Developing mode for instant code change **with** update SavAct browser specific functionality

```bash
yarn show
```

## Tests

In order to run the tests, start the test blockchain network first by executing the test run of the contract. 

Run all GUI tests in the background

```bash
yarn test
```

Start Cypress GUI to watch how the tests are performing in a browser (do not forget to build the application with `--dev` before)

```bash
yarn cypress open
```

Developing mode for instant code change **with** update SavAct browser specific functionality by using a test chain

```bash
yarn show --dev
```

Developing mode for instant code change by using test chain while using `cypress open`

```bash
yarn live --dev
```
## Security

To prevent malicious users from uploading excessively large images and overwhelming visitors' bandwidth, there is a custom component called `<pro-img>`. It accepts only images that are smaller than a predefined size in bytes. The default limit is 512\*512 bytes. However, some image hosts do not allow images to be loaded via script, so these hosts cannot be used.

Messages between buyer and seller are exchanged via third-party messengers of your choice. For example, via e-mail, [Simplex](https://simplex.chat/), [Telegram](https://telegram.org/), [WhatsApp](https://www.whatsapp.com/), and many more. You can generate and upload a public PGP key to present it to your customers. It is planned that the application will encrypt all exchanged chat messages for you in a later version. If you need encryption now, do it manually or use a chat messenger that encrypts messages in the background.

## Frontend Customization

See `GUI (SavWeb)/src/store/globals.ts`
for customizations like
`contract.account` for the contract account name and `gui.title` for the marketplace name on the frontend.