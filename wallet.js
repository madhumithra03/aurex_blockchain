/* =====================================================
   AUREX WALLET DASHBOARD
   Ethereum Sepolia
   NO METAMASK CONNECTION
===================================================== */


/* =====================================================
   CONFIGURATION
===================================================== */

const API_BASE =
    "http://localhost:5000/api";


const SEPOLIA_CHAIN_ID =
    11155111;


const SEPOLIA_EXPLORER =
    "https://sepolia.etherscan.io/tx/";


/* =====================================================
   GLOBAL WALLET
===================================================== */

let walletAddressValue =
    null;


let transactionData =
    [];


/* =====================================================
   ELEMENTS
===================================================== */


/* BALANCE */

const balanceAmount =
    document.getElementById(
        "balanceAmount"
    );


const balanceStatus =
    document.getElementById(
        "balanceStatus"
    );


const assetBalance =
    document.getElementById(
        "assetBalance"
    );


const sideBalance =
    document.getElementById(
        "sideBalance"
    );


const walletAddress =
    document.getElementById(
        "walletAddress"
    );


const sideAddress =
    document.getElementById(
        "sideAddress"
    );


/* ADDRESS */

const copyAddress =
    document.getElementById(
        "copyAddress"
    );


/* ACTIONS */

const receiveButton =
    document.getElementById(
        "receiveButton"
    );


const sendButton =
    document.getElementById(
        "sendButton"
    );


/* RECEIVE */

const receiveModal =
    document.getElementById(
        "receiveModal"
    );


const closeReceive =
    document.getElementById(
        "closeReceive"
    );


const receiveAddress =
    document.getElementById(
        "receiveAddress"
    );


const copyReceiveAddress =
    document.getElementById(
        "copyReceiveAddress"
    );


const qrcode =
    document.getElementById(
        "qrcode"
    );


/* SEND */

const sendModal =
    document.getElementById(
        "sendModal"
    );


const closeSend =
    document.getElementById(
        "closeSend"
    );


const sendFromAddress =
    document.getElementById(
        "sendFromAddress"
    );


const recipientAddress =
    document.getElementById(
        "recipientAddress"
    );


const pasteRecipient =
    document.getElementById(
        "pasteRecipient"
    );


const sendAmount =
    document.getElementById(
        "sendAmount"
    );


const sendTransaction =
    document.getElementById(
        "sendTransaction"
    );


const sendMessage =
    document.getElementById(
        "sendMessage"
    );


/* TRANSACTION */

const transactionList =
    document.getElementById(
        "transactionList"
    );


const refreshTransactions =
    document.getElementById(
        "refreshTransactions"
    );


const transactionButton =
    document.getElementById(
        "transactionButton"
    );


const transactionModal =
    document.getElementById(
        "transactionModal"
    );


const closeTransaction =
    document.getElementById(
        "closeTransaction"
    );


const detailStatus =
    document.getElementById(
        "detailStatus"
    );


const detailAmount =
    document.getElementById(
        "detailAmount"
    );


const detailFrom =
    document.getElementById(
        "detailFrom"
    );


const detailTo =
    document.getElementById(
        "detailTo"
    );


const detailDate =
    document.getElementById(
        "detailDate"
    );


const detailHash =
    document.getElementById(
        "detailHash"
    );


const explorerLink =
    document.getElementById(
        "explorerLink"
    );


/* HOME */

const homeButton =
    document.getElementById(
        "homeButton"
    );


/* =====================================================
   START WALLET
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        try {

            loadWalletSession();


            if (!walletAddressValue) {

                showEmptyActivity(
                    "Wallet session not found",
                    "Please return to AUREX and verify your wallet."
                );

                balanceStatus.textContent =
                    "Wallet session not found.";

                return;

            }


            displayWallet();


            await checkNetwork();


            await loadBalance();


            await loadTransactions();

        }
        catch (error) {

            console.error(
                "WALLET START ERROR:",
                error
            );


            balanceStatus.textContent =
                "Unable to connect to Sepolia.";

        }

    }
);


/* =====================================================
   LOAD SESSION
===================================================== */

function loadWalletSession() {

    const session =
        sessionStorage.getItem(
            "aurexWalletSession"
        );


    if (!session) {

        return;

    }


    try {

        const data =
            JSON.parse(
                session
            );


        walletAddressValue =
            data.address;

    }
    catch (error) {

        console.error(
            "SESSION ERROR:",
            error
        );

    }

}


/* =====================================================
   DISPLAY WALLET
===================================================== */

function displayWallet() {

    if (!walletAddressValue) {

        return;

    }


    const short =
        shortenAddress(
            walletAddressValue
        );


    walletAddress.textContent =
        short;


    sideAddress.textContent =
        short;


    receiveAddress.textContent =
        walletAddressValue;


    sendFromAddress.textContent =
        walletAddressValue;

}


/* =====================================================
   CHECK NETWORK
===================================================== */

async function checkNetwork() {

    const response =
        await fetch(
            `${API_BASE}/network`
        );


    if (!response.ok) {

        throw new Error(
            "Sepolia backend unavailable."
        );

    }


    const data =
        await response.json();


    if (
        Number(data.chainId) !==
        SEPOLIA_CHAIN_ID
    ) {

        throw new Error(
            "Backend is not connected to Sepolia."
        );

    }


    balanceStatus.textContent =
        "Connected to Ethereum Sepolia.";

}


/* =====================================================
   LOAD BALANCE
===================================================== */

async function loadBalance() {

    if (!walletAddressValue) {

        return;

    }


    balanceStatus.textContent =
        "Loading Sepolia balance...";


    const response =
        await fetch(
            `${API_BASE}/balance/${walletAddressValue}`
        );


    if (!response.ok) {

        throw new Error(
            "Unable to read wallet balance."
        );

    }


    const data =
        await response.json();


    const balance =
        Number(
            data.balance || 0
        );


    const formatted =
        balance.toFixed(4);


    balanceAmount.textContent =
        `${formatted} ETH`;


    assetBalance.textContent =
        `${formatted} ETH`;


    sideBalance.textContent =
        `${formatted} ETH`;


    balanceStatus.textContent =
        "Ethereum Sepolia balance";

}


/* =====================================================
   COPY ADDRESS
===================================================== */

copyAddress.addEventListener(
    "click",
    async function () {

        if (!walletAddressValue) {

            return;

        }


        try {

            await navigator.clipboard.writeText(
                walletAddressValue
            );


            copyAddress.textContent =
                "✓";


            setTimeout(
                function () {

                    copyAddress.textContent =
                        "⧉";

                },
                1200
            );

        }
        catch (error) {

            console.error(
                error
            );

        }

    }
);


/* =====================================================
   RECEIVE
===================================================== */

receiveButton.addEventListener(
    "click",
    function () {

        if (!walletAddressValue) {

            return;

        }


        receiveAddress.textContent =
            walletAddressValue;


        qrcode.innerHTML =
            "";


        if (
            typeof QRCode !==
            "undefined"
        ) {

            new QRCode(
                qrcode,
                {

                    text:
                        walletAddressValue,

                    width:
                        160,

                    height:
                        160

                }
            );

        }


        receiveModal.classList.add(
            "show"
        );

    }
);


/* =====================================================
   CLOSE RECEIVE
===================================================== */

closeReceive.addEventListener(
    "click",
    function () {

        receiveModal.classList.remove(
            "show"
        );

    }
);


/* =====================================================
   COPY RECEIVE ADDRESS
===================================================== */

copyReceiveAddress.addEventListener(
    "click",
    async function () {

        if (!walletAddressValue) {

            return;

        }


        try {

            await navigator.clipboard.writeText(
                walletAddressValue
            );


            copyReceiveAddress.textContent =
                "✓";


            setTimeout(
                function () {

                    copyReceiveAddress.textContent =
                        "⧉";

                },
                1200
            );

        }
        catch (error) {

            console.error(
                error
            );

        }

    }
);


/* =====================================================
   OPEN SEND
===================================================== */

sendButton.addEventListener(
    "click",
    function () {

        recipientAddress.value =
            "";


        sendAmount.value =
            "";


        sendMessage.textContent =
            "";


        sendFromAddress.textContent =
            walletAddressValue;


        sendModal.classList.add(
            "show"
        );

    }
);


/* =====================================================
   CLOSE SEND
===================================================== */

closeSend.addEventListener(
    "click",
    function () {

        sendModal.classList.remove(
            "show"
        );

    }
);


/* =====================================================
   PASTE RECIPIENT ADDRESS
===================================================== */

pasteRecipient.addEventListener(
    "click",
    async function () {

        try {

            const copied =
                await navigator.clipboard.readText();


            if (!copied) {

                sendMessage.style.color =
                    "#d9534f";

                sendMessage.textContent =
                    "Nothing found in clipboard.";

                return;

            }


            recipientAddress.value =
                copied.trim();


            sendMessage.style.color =
                "#53a96e";

            sendMessage.textContent =
                "Recipient address pasted.";

        }
        catch (error) {

            sendMessage.style.color =
                "#d9534f";

            sendMessage.textContent =
                "Please paste the address manually.";

        }

    }
);


/* =====================================================
   SEND TRANSACTION
===================================================== */

sendTransaction.addEventListener(
    "click",
    async function () {

        try {

            sendMessage.style.color =
                "#777";


            sendMessage.textContent =
                "Checking transaction...";


            /* =================================================
               RECIPIENT
            ================================================= */

            const recipient =
                recipientAddress.value.trim();


            if (
                !ethers.isAddress(
                    recipient
                )
            ) {

                throw new Error(
                    "Please enter a valid recipient address."
                );

            }


            /* =================================================
               CHECK OWN ADDRESS
            ================================================= */

            if (
                recipient.toLowerCase() ===
                walletAddressValue.toLowerCase()
            ) {

                throw new Error(
                    "You cannot send ETH to your own address."
                );

            }


            /* =================================================
               AMOUNT
            ================================================= */

            const amount =
                sendAmount.value.trim();


            if (!amount) {

                throw new Error(
                    "Please enter the ETH amount."
                );

            }


            const value =
                ethers.parseEther(
                    amount
                );


            if (
                value <=
                0n
            ) {

                throw new Error(
                    "Amount must be greater than zero."
                );

            }


            /* =================================================
               ENCRYPTED WALLET
            ================================================= */

            const encryptedWallet =
                localStorage.getItem(
                    "aurexEncryptedWallet"
                );


            if (!encryptedWallet) {

                throw new Error(
                    "Encrypted wallet not found. Please create or import your AUREX wallet again."
                );

            }


            /* =================================================
               PASSWORD
            ================================================= */

            const password =
                window.prompt(
                    "Enter your AUREX wallet password:"
                );


            if (!password) {

                throw new Error(
                    "Wallet password is required."
                );

            }


            sendTransaction.disabled =
                true;


            sendTransaction.textContent =
                "Unlocking wallet...";


            /* =================================================
               DECRYPT WALLET
            ================================================= */

            const wallet =
                await ethers.Wallet.fromEncryptedJson(
                    encryptedWallet,
                    password
                );


            /* =================================================
               VERIFY ADDRESS
            ================================================= */

            if (
                wallet.address.toLowerCase() !==
                walletAddressValue.toLowerCase()
            ) {

                throw new Error(
                    "Wallet address mismatch."
                );

            }


            sendMessage.textContent =
                "Connecting to Sepolia...";


            /* =================================================
               CONNECT TO BACKEND RPC
            ================================================= */

            const provider =
                new ethers.JsonRpcProvider(
                    "http://localhost:5000/api/rpc"
                );


            /* =================================================
               CHECK NETWORK
            ================================================= */

            const network =
                await provider.getNetwork();


            if (
                Number(network.chainId) !==
                SEPOLIA_CHAIN_ID
            ) {

                throw new Error(
                    "The RPC connection is not Ethereum Sepolia."
                );

            }


            /* =================================================
               CONNECT WALLET
            ================================================= */

            const signer =
                wallet.connect(
                    provider
                );


            /* =================================================
               BALANCE
            ================================================= */

            const balance =
                await provider.getBalance(
                    wallet.address
                );


            /* =================================================
               GAS ESTIMATE
            ================================================= */

            const gasEstimate =
                await provider.estimateGas({

                    from:
                        wallet.address,

                    to:
                        recipient,

                    value:
                        value

                });


            const feeData =
                await provider.getFeeData();


            const gasPrice =
                feeData.gasPrice;


            let estimatedFee =
                0n;


            if (gasPrice) {

                estimatedFee =
                    gasEstimate *
                    gasPrice;

            }


            const required =
                value +
                estimatedFee;


            if (
                required >
                balance
            ) {

                throw new Error(
                    `Insufficient Sepolia ETH. Required approximately ${ethers.formatEther(required)} ETH including gas.`
                );

            }


            sendMessage.textContent =
                "Signing Sepolia transaction...";


            sendTransaction.textContent =
                "Signing...";


            /* =================================================
               SIGN + SEND
            ================================================= */

            const transaction =
                await signer.sendTransaction({

                    to:
                        recipient,

                    value:
                        value

                });


            sendMessage.textContent =
                "Transaction submitted. Waiting for confirmation...";


            sendTransaction.textContent =
                "Waiting...";


            /* =================================================
               WAIT FOR CONFIRMATION
            ================================================= */

            const receipt =
                await transaction.wait();


            if (!receipt) {

                throw new Error(
                    "Transaction was submitted but confirmation was not received."
                );

            }


            /* =================================================
               SUCCESS
            ================================================= */

            sendModal.classList.remove(
                "show"
            );


            await loadBalance();


            await loadTransactions();


            openTransactionDetails({

                hash:
                    transaction.hash,

                from:
                    wallet.address,

                to:
                    recipient,

                valueEth:
                    amount,

                timestamp:
                    new Date().toISOString(),

                status:
                    "confirmed"

            });


        }
        catch (error) {

            console.error(
                "SEND ERROR:",
                error
            );


            sendMessage.style.color =
                "#d9534f";


            sendMessage.textContent =
                getErrorMessage(
                    error
                );

        }
        finally {

            sendTransaction.disabled =
                false;


            sendTransaction.textContent =
                "Send ETH →";

        }

    }
);


/* =====================================================
   LOAD TRANSACTION HISTORY
===================================================== */

async function loadTransactions() {

    if (!walletAddressValue) {

        return;

    }


    transactionList.innerHTML =
        loadingActivity();


    try {

        const response =
            await fetch(
                `${API_BASE}/transactions/${walletAddressValue}`
            );


        if (!response.ok) {

            throw new Error(
                "Transaction history request failed."
            );

        }


        const data =
            await response.json();


        transactionData =
            data.transactions ||
            [];


        renderTransactions();

    }
    catch (error) {

        console.error(
            "HISTORY ERROR:",
            error
        );


        transactionList.innerHTML =
            emptyActivity(
                "Transaction history unavailable",
                "Make sure your AUREX backend is running."
            );

    }

}


/* =====================================================
   RENDER TRANSACTIONS
===================================================== */

function renderTransactions() {

    if (
        transactionData.length ===
        0
    ) {

        transactionList.innerHTML =
            emptyActivity(
                "No transactions yet",
                "Your Sepolia transactions will appear here."
            );

        return;

    }


    transactionList.innerHTML =
        "";


    transactionData.forEach(
        function (tx) {

            const isSent =
                tx.from &&
                tx.from.toLowerCase() ===
                walletAddressValue.toLowerCase();


            const direction =
                isSent
                    ? "sent"
                    : "received";


            const icon =
                isSent
                    ? "↑"
                    : "↓";


            const otherAddress =
                isSent
                    ? tx.to
                    : tx.from;


            const amount =
                Number(
                    tx.valueEth || 0
                ).toFixed(4);


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "transaction-card";


            card.innerHTML = `

                <div class="transaction-icon ${direction}">

                    ${icon}

                </div>


                <div class="transaction-info">

                    <strong>

                        ${isSent
                            ? "Sent ETH"
                            : "Received ETH"}

                    </strong>


                    <small>

                        ${isSent
                            ? "To: "
                            : "From: "}

                        ${shortenAddress(
                            otherAddress
                        )}

                    </small>


                    <small>

                        ${formatDate(
                            tx.timestamp
                        )}

                    </small>

                </div>


                <div class="transaction-amount">

                    <strong
                        class="${isSent
                            ? "negative"
                            : "positive"}">

                        ${isSent ? "-" : "+"}
                        ${amount} ETH

                    </strong>


                    <small>

                        ${formatStatus(
                            tx.status
                        )}

                    </small>

                </div>


                <button
                    class="view-transaction">

                    View

                </button>

            `;


            const viewButton =
                card.querySelector(
                    ".view-transaction"
                );


            viewButton.addEventListener(
                "click",
                function () {

                    openTransactionDetails(
                        tx
                    );

                }
            );


            transactionList.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   OPEN TRANSACTION DETAILS
===================================================== */

function openTransactionDetails(
    tx
) {

    detailStatus.textContent =
        formatStatus(
            tx.status
        );


    detailAmount.textContent =
        `${Number(
            tx.valueEth || 0
        ).toFixed(6)} ETH`;


    detailFrom.textContent =
        tx.from ||
        "-";


    detailTo.textContent =
        tx.to ||
        "-";


    detailDate.textContent =
        formatDate(
            tx.timestamp
        );


    detailHash.textContent =
        tx.hash ||
        "-";


    explorerLink.href =
        `${SEPOLIA_EXPLORER}${tx.hash}`;


    transactionModal.classList.add(
        "show"
    );

}


/* =====================================================
   REFRESH TRANSACTIONS
===================================================== */

refreshTransactions.addEventListener(
    "click",
    async function () {

        await loadBalance();

        await loadTransactions();

    }
);


/* =====================================================
   OPEN TRANSACTION PAGE
===================================================== */

transactionButton.addEventListener(
    "click",
    function () {

        /*
            We keep the transaction view
            inside the wallet itself.

            Scroll to Recent Activity.
        */

        document
            .querySelector(
                ".activity-title"
            )
            .scrollIntoView({
                behavior:
                    "smooth"
            });

    }
);


/* =====================================================
   HOME
===================================================== */

homeButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "index.html";

    }
);


/* =====================================================
   CLOSE TRANSACTION
===================================================== */

closeTransaction.addEventListener(
    "click",
    function () {

        transactionModal.classList.remove(
            "show"
        );

    }
);


/* =====================================================
   CLOSE MODALS
===================================================== */

window.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            receiveModal
        ) {

            receiveModal.classList.remove(
                "show"
            );

        }


        if (
            event.target ===
            sendModal
        ) {

            sendModal.classList.remove(
                "show"
            );

        }


        if (
            event.target ===
            transactionModal
        ) {

            transactionModal.classList.remove(
                "show"
            );

        }

    }
);


/* =====================================================
   EMPTY ACTIVITY
===================================================== */

function emptyActivity(
    title,
    message
) {

    return `

        <div class="empty-activity">

            <div class="activity-icon">

                ↔

            </div>


            <strong>

                ${title}

            </strong>


            <p>

                ${message}

            </p>

        </div>

    `;

}


/* =====================================================
   LOADING
===================================================== */

function loadingActivity() {

    return `

        <div class="empty-activity">

            <div class="activity-icon">

                ◌

            </div>


            <strong>

                Loading transactions...

            </strong>


            <p>

                Checking Ethereum Sepolia.

            </p>

        </div>

    `;

}


/* =====================================================
   SHORTEN ADDRESS
===================================================== */

function shortenAddress(
    value
) {

    if (!value) {

        return "0x......";

    }


    return (
        value.substring(
            0,
            6
        ) +
        "..." +
        value.substring(
            value.length - 4
        )
    );

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(
    timestamp
) {

    if (!timestamp) {

        return "Unknown date";

    }


    const date =
        new Date(
            timestamp
        );


    return date.toLocaleString();

}


/* =====================================================
   STATUS
===================================================== */

function formatStatus(
    status
) {

    if (!status) {

        return "Confirmed";

    }


    if (
        status === "ok" ||
        status === "confirmed"
    ) {

        return "Confirmed";

    }


    if (
        status === "failed"
    ) {

        return "Failed";

    }


    return status;

}


/* =====================================================
   ERROR MESSAGE
===================================================== */

function getErrorMessage(
    error
) {

    const message =
        error &&
        error.message
            ? error.message
            : "Transaction failed.";


    if (
        message
            .toLowerCase()
            .includes(
                "password"
            )
    ) {

        return "Incorrect wallet password.";

    }


    if (
        message
            .toLowerCase()
            .includes(
                "insufficient"
            )
    ) {

        return message;

    }


    return message;

}