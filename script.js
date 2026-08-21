/* =====================================================
   AUREX BLOCKCHAIN WALLET
   FRONT PAGE SCRIPT

   NETWORK:
   Ethereum Sepolia
   Chain ID: 11155111

   MetaMask:
   NOT USED
===================================================== */


/* =====================================================
   SEPOLIA CONFIGURATION
===================================================== */

const AUREX_NETWORK =
    "Ethereum Sepolia";

const AUREX_CHAIN_ID =
    11155111;


/* =====================================================
   ELEMENTS
===================================================== */


/* CREATE / IMPORT */

const createWalletButton =
    document.getElementById(
        "createWalletButton"
    );

const importWalletButton =
    document.getElementById(
        "importWalletButton"
    );


/* =====================================================
   PASSWORD MODAL
===================================================== */

const passwordModal =
    document.getElementById(
        "passwordModal"
    );

const closePasswordModal =
    document.getElementById(
        "closePasswordModal"
    );

const confirmCreateWallet =
    document.getElementById(
        "confirmCreateWallet"
    );

const createPassword =
    document.getElementById(
        "createPassword"
    );

const confirmPassword =
    document.getElementById(
        "confirmPassword"
    );

const passwordMessage =
    document.getElementById(
        "passwordMessage"
    );


/* =====================================================
   WALLET CREATED MODAL
===================================================== */

const walletModal =
    document.getElementById(
        "walletModal"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );


/* =====================================================
   IMPORT MODAL
===================================================== */

const importModal =
    document.getElementById(
        "importModal"
    );

const closeImportModal =
    document.getElementById(
        "closeImportModal"
    );

const confirmImport =
    document.getElementById(
        "confirmImport"
    );


/* =====================================================
   WALLET DATA
===================================================== */

const phraseContainer =
    document.getElementById(
        "phraseContainer"
    );

const generatedAddress =
    document.getElementById(
        "generatedAddress"
    );

const walletAddress =
    document.getElementById(
        "walletAddress"
    );

const ethBalance =
    document.getElementById(
        "ethBalance"
    );

const networkName =
    document.getElementById(
        "networkName"
    );

const phoneBalance =
    document.getElementById(
        "phoneBalance"
    );

const phoneEth =
    document.getElementById(
        "phoneEth"
    );


/* =====================================================
   COPY
===================================================== */

const copyPhraseButton =
    document.getElementById(
        "copyPhraseButton"
    );

const copyPhraseMessage =
    document.getElementById(
        "copyPhraseMessage"
    );

const copyAddressButton =
    document.getElementById(
        "copyAddressButton"
    );


/* =====================================================
   JSON
===================================================== */

const downloadJson =
    document.getElementById(
        "downloadJson"
    );


/* =====================================================
   IMPORT
===================================================== */

const importPhrase =
    document.getElementById(
        "importPhrase"
    );

const importMessage =
    document.getElementById(
        "importMessage"
    );


/* =====================================================
   CURRENT WALLET
===================================================== */

let currentWallet =
    null;

let generatedWalletJson =
    null;

let currentRecoveryPhrase =
    "";


/* =====================================================
   CREATE WALLET BUTTON
===================================================== */

if (createWalletButton) {

    createWalletButton.addEventListener(
        "click",
        function () {

            createPassword.value =
                "";

            confirmPassword.value =
                "";

            passwordMessage.textContent =
                "";

            passwordModal.classList.add(
                "show"
            );

        }
    );

}


/* =====================================================
   CREATE WALLET
===================================================== */

if (confirmCreateWallet) {

    confirmCreateWallet.addEventListener(
        "click",
        async function () {

            const password =
                createPassword.value.trim();

            const confirm =
                confirmPassword.value.trim();


            /* =================================================
               PASSWORD VALIDATION
            ================================================= */


            if (!password) {

                showPasswordError(
                    "Please create a password."
                );

                return;

            }


            if (password.length < 8) {

                showPasswordError(
                    "Password must be at least 8 characters."
                );

                return;

            }


            if (!confirm) {

                showPasswordError(
                    "Please confirm your password."
                );

                return;

            }


            if (password !== confirm) {

                showPasswordError(
                    "Passwords do not match."
                );

                return;

            }


            /* =================================================
               CREATE WALLET
            ================================================= */

            try {

                confirmCreateWallet.disabled =
                    true;

                confirmCreateWallet.textContent =
                    "Creating Wallet...";


                /*
                    Create a completely new
                    Ethereum wallet.
                */

                const wallet =
                    ethers.Wallet.createRandom();


                currentWallet =
                    wallet;


                /*
                    Store recovery phrase
                    temporarily for display.
                */

                currentRecoveryPhrase =
                    wallet.mnemonic.phrase;


                /* =================================================
                   DISPLAY 12 WORDS
                ================================================= */

                phraseContainer.innerHTML =
                    "";


                const words =
                    currentRecoveryPhrase.split(
                        " "
                    );


                words.forEach(
                    function (
                        word,
                        index
                    ) {

                        const phrase =
                            document.createElement(
                                "div"
                            );


                        phrase.className =
                            "phrase";


                        phrase.innerHTML =
                            `<strong>${index + 1}.</strong> ${word}`;


                        phraseContainer.appendChild(
                            phrase
                        );

                    }
                );


                /* =================================================
                   DISPLAY ADDRESS
                ================================================= */

                generatedAddress.textContent =
                    wallet.address;


                walletAddress.textContent =
                    shortenAddress(
                        wallet.address
                    );


                /* =================================================
                   NETWORK
                ================================================= */

                if (networkName) {

                    networkName.textContent =
                        AUREX_NETWORK;

                }


                /* =================================================
                   INITIAL BALANCE
                ================================================= */

                if (ethBalance) {

                    ethBalance.textContent =
                        "0 ETH";

                }


                if (phoneBalance) {

                    phoneBalance.textContent =
                        "0 ETH";

                }


                if (phoneEth) {

                    phoneEth.textContent =
                        "0.00";

                }


                /* =================================================
                   ENCRYPT WALLET
                ================================================= */

                /*
                    This is extremely important.

                    The encrypted wallet is stored locally.

                    The raw private key is NOT stored
                    in localStorage.

                    The password is NOT stored.
                */

                const encryptedKeystore =
                    await wallet.encrypt(
                        password
                    );


                /* =================================================
                   SAVE ENCRYPTED WALLET
                   FOR WALLET DASHBOARD
                ================================================= */

                localStorage.setItem(
                    "aurexEncryptedWallet",
                    encryptedKeystore
                );


                localStorage.setItem(
                    "aurexWalletAddress",
                    wallet.address
                );


                localStorage.setItem(
                    "aurexWalletNetwork",
                    AUREX_NETWORK
                );


                localStorage.setItem(
                    "aurexWalletChainId",
                    String(
                        AUREX_CHAIN_ID
                    )
                );


                /* =================================================
                   CREATE WALLET JSON
                ================================================= */

                /*
                    This JSON is for your project
                    / educational requirement.

                    IMPORTANT:
                    It contains the private key.
                    Do NOT share this file.
                */

                generatedWalletJson = {

                    format:
                        "AUREX-WALLET",

                    version:
                        "1.0",

                    network:
                        AUREX_NETWORK,

                    chainId:
                        AUREX_CHAIN_ID,

                    address:
                        wallet.address,

                    publicKey:
                        wallet.signingKey.publicKey,

                    privateKey:
                        wallet.privateKey,

                    encryptedKeystore:
                        JSON.parse(
                            encryptedKeystore
                        )

                };


                /* =================================================
                   PENDING WALLET
                ================================================= */

                /*
                    Only public information is placed
                    into sessionStorage.

                    Private key is NOT placed here.
                */

                sessionStorage.setItem(
                    "aurexPendingWallet",
                    JSON.stringify({

                        address:
                            wallet.address,

                        publicKey:
                            wallet.signingKey.publicKey

                    })
                );


                /* =================================================
                   CLEAR PASSWORD FIELDS
                ================================================= */

                createPassword.value =
                    "";

                confirmPassword.value =
                    "";


                /* =================================================
                   CLOSE PASSWORD MODAL
                ================================================= */

                passwordModal.classList.remove(
                    "show"
                );


                /* =================================================
                   OPEN WALLET CREATED MODAL
                ================================================= */

                walletModal.classList.add(
                    "show"
                );

            }
            catch (error) {

                console.error(
                    "CREATE WALLET ERROR:",
                    error
                );


                showPasswordError(
                    "Something went wrong while creating the wallet."
                );

            }
            finally {

                confirmCreateWallet.disabled =
                    false;

                confirmCreateWallet.textContent =
                    "Create Wallet →";

            }

        }
    );

}


/* =====================================================
   COPY RECOVERY PHRASE
===================================================== */

if (copyPhraseButton) {

    copyPhraseButton.addEventListener(
        "click",
        async function () {

            if (
                !currentRecoveryPhrase
            ) {

                return;

            }


            try {

                await navigator.clipboard.writeText(
                    currentRecoveryPhrase
                );


                if (copyPhraseMessage) {

                    copyPhraseMessage.style.color =
                        "#4b9b67";

                    copyPhraseMessage.textContent =
                        "Recovery phrase copied successfully.";

                }

            }
            catch (error) {

                console.error(
                    error
                );


                if (copyPhraseMessage) {

                    copyPhraseMessage.style.color =
                        "#d9534f";

                    copyPhraseMessage.textContent =
                        "Copy failed. Please copy it manually.";

                }

            }

        }
    );

}


/* =====================================================
   COPY WALLET ADDRESS
===================================================== */

if (copyAddressButton) {

    copyAddressButton.addEventListener(
        "click",
        async function () {

            if (!currentWallet) {

                return;

            }


            try {

                await navigator.clipboard.writeText(
                    currentWallet.address
                );


                if (copyPhraseMessage) {

                    copyPhraseMessage.style.color =
                        "#4b9b67";

                    copyPhraseMessage.textContent =
                        "Wallet address copied.";

                }

            }
            catch (error) {

                console.error(
                    error
                );


                if (copyPhraseMessage) {

                    copyPhraseMessage.style.color =
                        "#d9534f";

                    copyPhraseMessage.textContent =
                        "Copy failed.";

                }

            }

        }
    );

}


/* =====================================================
   DOWNLOAD WALLET JSON
===================================================== */

if (downloadJson) {

    downloadJson.addEventListener(
        "click",
        function () {

            if (!generatedWalletJson) {

                alert(
                    "Wallet JSON is not available."
                );

                return;

            }


            /*
                Convert wallet object
                to readable JSON.
            */

            const jsonText =
                JSON.stringify(
                    generatedWalletJson,
                    null,
                    2
                );


            const blob =
                new Blob(
                    [jsonText],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "aurex-wallet.json";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            URL.revokeObjectURL(
                url
            );


            /*
                Continue to verification page.
            */

            setTimeout(
                function () {

                    window.location.href =
                        "verify.html";

                },
                700
            );

        }
    );

}


/* =====================================================
   IMPORT WALLET BUTTON
===================================================== */

if (importWalletButton) {

    importWalletButton.addEventListener(
        "click",
        function () {

            importPhrase.value =
                "";

            importMessage.textContent =
                "";

            importModal.classList.add(
                "show"
            );

        }
    );

}


/* =====================================================
   IMPORT WALLET
===================================================== */

if (confirmImport) {

    confirmImport.addEventListener(
        "click",
        async function () {

            try {

                const phrase =
                    importPhrase.value.trim();


                /* =================================================
                   CHECK EMPTY
                ================================================= */

                if (!phrase) {

                    showImportError(
                        "Please enter your recovery phrase."
                    );

                    return;

                }


                /* =================================================
                   CHECK WORD COUNT
                ================================================= */

                const words =
                    phrase.split(
                        /\s+/
                    );


                if (
                    words.length !== 12
                ) {

                    showImportError(
                        "Please enter exactly 12 words."
                    );

                    return;

                }


                /* =================================================
                   CREATE WALLET FROM PHRASE
                ================================================= */

                const wallet =
                    ethers.Wallet.fromPhrase(
                        phrase
                    );


                currentWallet =
                    wallet;


                currentRecoveryPhrase =
                    phrase;


                /* =================================================
                   DISPLAY ADDRESS
                ================================================= */

                if (generatedAddress) {

                    generatedAddress.textContent =
                        wallet.address;

                }


                if (walletAddress) {

                    walletAddress.textContent =
                        shortenAddress(
                            wallet.address
                        );

                }


                /* =================================================
                   NETWORK
                ================================================= */

                if (networkName) {

                    networkName.textContent =
                        AUREX_NETWORK;

                }


                /* =================================================
                   BALANCE
                ================================================= */

                if (ethBalance) {

                    ethBalance.textContent =
                        "0 ETH";

                }


                if (phoneBalance) {

                    phoneBalance.textContent =
                        "0 ETH";

                }


                if (phoneEth) {

                    phoneEth.textContent =
                        "0.00";

                }


                /* =================================================
                   ASK FOR PASSWORD
                ================================================= */

                /*
                    The imported wallet also needs an
                    encrypted keystore because the
                    dashboard uses that encrypted wallet
                    when signing Sepolia transactions.
                */

                const password =
                    window.prompt(
                        "Create an AUREX password for this imported wallet:"
                    );


                if (!password) {

                    showImportError(
                        "Password is required for the imported wallet."
                    );

                    return;

                }


                if (
                    password.length < 8
                ) {

                    showImportError(
                        "Password must be at least 8 characters."
                    );

                    return;

                }


                /* =================================================
                   ENCRYPT IMPORTED WALLET
                ================================================= */

                confirmImport.disabled =
                    true;

                confirmImport.textContent =
                    "Securing Wallet...";


                const encryptedKeystore =
                    await wallet.encrypt(
                        password
                    );


                /* =================================================
                   SAVE ENCRYPTED WALLET
                ================================================= */

                localStorage.setItem(
                    "aurexEncryptedWallet",
                    encryptedKeystore
                );


                localStorage.setItem(
                    "aurexWalletAddress",
                    wallet.address
                );


                localStorage.setItem(
                    "aurexWalletNetwork",
                    AUREX_NETWORK
                );


                localStorage.setItem(
                    "aurexWalletChainId",
                    String(
                        AUREX_CHAIN_ID
                    )
                );


                /* =================================================
                   SESSION
                ================================================= */

                sessionStorage.setItem(
                    "aurexWalletSession",
                    JSON.stringify({

                        address:
                            wallet.address,

                        publicKey:
                            wallet.signingKey.publicKey,

                        verified:
                            true

                    })
                );


                /* =================================================
                   SUCCESS
                ================================================= */

                importMessage.style.color =
                    "#4b9b67";

                importMessage.textContent =
                    "Wallet imported successfully!";


                setTimeout(
                    function () {

                        window.location.href =
                            "wallet.html";

                    },
                    800
                );

            }
            catch (error) {

                console.error(
                    "IMPORT ERROR:",
                    error
                );


                showImportError(
                    "Invalid recovery phrase."
                );

            }
            finally {

                confirmImport.disabled =
                    false;

                confirmImport.textContent =
                    "Import Wallet →";

            }

        }
    );

}


/* =====================================================
   CLOSE PASSWORD MODAL
===================================================== */

if (closePasswordModal) {

    closePasswordModal.addEventListener(
        "click",
        function () {

            passwordModal.classList.remove(
                "show"
            );


            createPassword.value =
                "";

            confirmPassword.value =
                "";

            passwordMessage.textContent =
                "";

        }
    );

}


/* =====================================================
   CLOSE WALLET MODAL
===================================================== */

if (closeModal) {

    closeModal.addEventListener(
        "click",
        function () {

            walletModal.classList.remove(
                "show"
            );

        }
    );

}


/* =====================================================
   CLOSE IMPORT MODAL
===================================================== */

if (closeImportModal) {

    closeImportModal.addEventListener(
        "click",
        function () {

            importModal.classList.remove(
                "show"
            );

        }
    );

}


/* =====================================================
   CLICK OUTSIDE MODALS
===================================================== */

window.addEventListener(
    "click",
    function (event) {


        if (
            event.target ===
            passwordModal
        ) {

            passwordModal.classList.remove(
                "show"
            );

        }


        if (
            event.target ===
            walletModal
        ) {

            walletModal.classList.remove(
                "show"
            );

        }


        if (
            event.target ===
            importModal
        ) {

            importModal.classList.remove(
                "show"
            );

        }

    }
);


/* =====================================================
   PASSWORD ERROR
===================================================== */

function showPasswordError(
    message
) {

    if (!passwordMessage) {
        return;
    }


    passwordMessage.style.color =
        "#d9534f";


    passwordMessage.textContent =
        message;

}


/* =====================================================
   IMPORT ERROR
===================================================== */

function showImportError(
    message
) {

    if (!importMessage) {
        return;
    }


    importMessage.style.color =
        "#d9534f";


    importMessage.textContent =
        message;

}


/* =====================================================
   SHORTEN ADDRESS
===================================================== */

function shortenAddress(
    address
) {

    if (!address) {

        return "0x......";

    }


    return (
        address.substring(
            0,
            6
        ) +
        "..." +
        address.substring(
            address.length - 4
        )
    );

}


/* =====================================================
   DEBUG INFORMATION
===================================================== */

console.log(
    "======================================"
);

console.log(
    "AUREX WALLET"
);

console.log(
    "Network:",
    AUREX_NETWORK
);

console.log(
    "Chain ID:",
    AUREX_CHAIN_ID
);

console.log(
    "MetaMask: NOT CONNECTED"
);

console.log(
    "======================================"
);