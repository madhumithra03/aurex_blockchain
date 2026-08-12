/* =====================================================
   AUREX BLOCKCHAIN WALLET
===================================================== */


/* ---------- ELEMENTS ---------- */

const connectButton =
    document.getElementById("connectButton");

const createWalletButton =
    document.getElementById("createWalletButton");

const importWalletButton =
    document.getElementById("importWalletButton");

const walletModal =
    document.getElementById("walletModal");

const importModal =
    document.getElementById("importModal");

const closeModal =
    document.getElementById("closeModal");

const closeImportModal =
    document.getElementById("closeImportModal");

const confirmImport =
    document.getElementById("confirmImport");

const phraseContainer =
    document.getElementById("phraseContainer");

const generatedAddress =
    document.getElementById("generatedAddress");

const walletAddress =
    document.getElementById("walletAddress");

const ethBalance =
    document.getElementById("ethBalance");

const networkName =
    document.getElementById("networkName");

const phoneBalance =
    document.getElementById("phoneBalance");

const phoneEth =
    document.getElementById("phoneEth");

const downloadJson =
    document.getElementById("downloadJson");

const importPhrase =
    document.getElementById("importPhrase");

const importMessage =
    document.getElementById("importMessage");


/* ---------- CURRENT WALLET ---------- */

let currentWallet = null;

let generatedJson = null;


/* =====================================================
   CREATE WALLET
===================================================== */

createWalletButton.addEventListener(
    "click",
    async function () {

        try {

            /*
             * ethers creates a cryptographically secure
             * random wallet with a 12-word mnemonic.
             */

            const wallet =
                ethers.Wallet.createRandom();


            currentWallet = wallet;


            /* ---------- DISPLAY 12 WORDS ---------- */

            phraseContainer.innerHTML = "";


            const words =
                wallet.mnemonic.phrase.split(" ");


            words.forEach(
                function (word, index) {

                    const phrase =
                        document.createElement("div");

                    phrase.className = "phrase";

                    phrase.innerHTML =
                        `<strong>${index + 1}.</strong> ${word}`;

                    phraseContainer.appendChild(
                        phrase
                    );

                }
            );


            /* ---------- DISPLAY ADDRESS ---------- */

            generatedAddress.textContent =
                wallet.address;


            /*
             * ethers Wallet can produce an encrypted
             * JSON keystore.
             *
             * A password is requested locally rather
             * than putting a private key directly in
             * the webpage.
             */

            const password =
                prompt(
                    "Create a password to encrypt your wallet JSON:"
                );


            if (!password) {

                alert(
                    "Wallet created, but encrypted JSON was not generated because no password was provided."
                );

                generatedJson = null;

            } else {

                generatedJson =
                    await wallet.encrypt(password);

            }


            /* ---------- SHOW MODAL ---------- */

            walletModal.classList.add("show");

        }

        catch (error) {

            console.error(error);

            alert(
                "Something went wrong while creating the wallet."
            );

        }

    }
);


/* =====================================================
   IMPORT WALLET
===================================================== */

importWalletButton.addEventListener(
    "click",
    function () {

        importModal.classList.add("show");

        importMessage.textContent = "";

        importPhrase.value = "";

    }
);


/* =====================================================
   CONFIRM IMPORT
===================================================== */

confirmImport.addEventListener(
    "click",
    async function () {

        try {

            const phrase =
                importPhrase.value.trim();


            if (!phrase) {

                importMessage.textContent =
                    "Please enter a recovery phrase.";

                return;

            }


            const words =
                phrase.split(/\s+/);


            /*
             * We only accept a 12-word phrase for
             * this assignment.
             */

            if (words.length !== 12) {

                importMessage.textContent =
                    "Please enter exactly 12 words.";

                return;

            }


            const wallet =
                ethers.Wallet.fromPhrase(phrase);


            currentWallet = wallet;


            walletAddress.textContent =
                wallet.address;


            importMessage.style.color =
                "#4b9b67";

            importMessage.textContent =
                "Wallet imported successfully!";


            setTimeout(
                function () {

                    importModal.classList.remove("show");

                },
                1000
            );


            /*
             * Update displayed wallet address.
             */

            walletAddress.textContent =
                wallet.address;


            networkName.textContent =
                "Ethereum";


            /*
             * Update phone design.
             */

            phoneBalance.textContent =
                "0 ETH";

            phoneEth.textContent =
                "0.00";

        }

        catch (error) {

            console.error(error);

            importMessage.style.color =
                "#d9534f";

            importMessage.textContent =
                "Invalid recovery phrase.";

        }

    }
);


/* =====================================================
   CLOSE MODALS
===================================================== */

closeModal.addEventListener(
    "click",
    function () {

        walletModal.classList.remove("show");

    }
);


closeImportModal.addEventListener(
    "click",
    function () {

        importModal.classList.remove("show");

    }
);


/* =====================================================
   DOWNLOAD ENCRYPTED WALLET JSON
===================================================== */

downloadJson.addEventListener(
    "click",
    function () {

        if (!generatedJson) {

            alert(
                "No encrypted wallet JSON is available."
            );

            return;

        }


        const blob =
            new Blob(
                [generatedJson],
                {
                    type: "application/json"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "aurex-wallet.json";


        link.click();


        URL.revokeObjectURL(url);

    }
);


/* =====================================================
   METAMASK CONNECTION
===================================================== */

connectButton.addEventListener(
    "click",
    async function () {

        /*
         * Check whether MetaMask/browser wallet
         * provider exists.
         */

        if (!window.ethereum) {

            alert(
                "MetaMask was not detected. Please open this page in a browser profile where MetaMask is installed and enabled."
            );

            return;

        }


        try {

            /*
             * Ask MetaMask to connect.
             */

            const accounts =
                await window.ethereum.request(
                    {
                        method:
                            "eth_requestAccounts"
                    }
                );


            if (!accounts.length) {

                return;

            }


            const address =
                accounts[0];


            /* ---------- ETHERS PROVIDER ---------- */

            const provider =
                new ethers.BrowserProvider(
                    window.ethereum
                );


            /* ---------- NETWORK ---------- */

            const network =
                await provider.getNetwork();


            networkName.textContent =
                network.name === "unknown"
                    ? `Chain ${network.chainId}`
                    : network.name;


            /* ---------- BALANCE ---------- */

            const balance =
                await provider.getBalance(address);


            const eth =
                ethers.formatEther(balance);


            /* ---------- DISPLAY ---------- */

            walletAddress.textContent =
                shortenAddress(address);


            ethBalance.textContent =
                `${Number(eth).toFixed(4)} ETH`;


            phoneBalance.textContent =
                `${Number(eth).toFixed(4)} ETH`;


            phoneEth.textContent =
                Number(eth).toFixed(4);


            /* ---------- BUTTON ---------- */

            connectButton.textContent =
                "🦊 " +
                shortenAddress(address);


            connectButton.classList.add(
                "connected"
            );

        }

        catch (error) {

            console.error(error);

            alert(
                "MetaMask connection was cancelled or failed."
            );

        }

    }
);


/* =====================================================
   SHORTEN ADDRESS
===================================================== */

function shortenAddress(address) {

    return (
        address.substring(0, 6) +
        "..." +
        address.substring(
            address.length - 4
        )
    );

}


/* =====================================================
   METAMASK ACCOUNT CHANGE
===================================================== */

if (window.ethereum) {

    window.ethereum.on(
        "accountsChanged",
        async function (accounts) {

            if (!accounts.length) {

                walletAddress.textContent =
                    "Not Connected";

                ethBalance.textContent =
                    "0 ETH";

                networkName.textContent =
                    "Not Connected";

                connectButton.textContent =
                    "🦊 Connect MetaMask";

                phoneBalance.textContent =
                    "0 ETH";

                phoneEth.textContent =
                    "0.00";

                return;

            }


            /*
             * Refresh balance when user changes
             * MetaMask account.
             */

            connectButton.click();

        }
    );

}