/* =====================================================
   AUREX TRANSACTIONS
   Ethereum Sepolia
===================================================== */

const API_BASE =
    "http://localhost:5000/api";

const SEPOLIA_EXPLORER =
    "https://sepolia.etherscan.io/tx/";


/* =====================================================
   ELEMENTS
===================================================== */

const walletAddress =
    document.getElementById(
        "walletAddress"
    );

const copyAddress =
    document.getElementById(
        "copyAddress"
    );

const refreshButton =
    document.getElementById(
        "refreshButton"
    );

const transactionList =
    document.getElementById(
        "transactionList"
    );

const totalTransactions =
    document.getElementById(
        "totalTransactions"
    );

const sentTransactions =
    document.getElementById(
        "sentTransactions"
    );

const receivedTransactions =
    document.getElementById(
        "receivedTransactions"
    );


/* MODAL */

const transactionModal =
    document.getElementById(
        "transactionModal"
    );

const closeModal =
    document.getElementById(
        "closeModal"
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


/* BACK */

const backWallet =
    document.getElementById(
        "backWallet"
    );


/* =====================================================
   WALLET
===================================================== */

let address =
    null;

let transactions =
    [];


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        loadWallet();

        if (!address) {

            transactionList.innerHTML =
                emptyView(
                    "Wallet not found",
                    "Please return to AUREX and verify your wallet."
                );

            return;

        }


        walletAddress.textContent =
            address;


        await loadTransactions();

    }
);


/* =====================================================
   LOAD WALLET
===================================================== */

function loadWallet() {

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


        address =
            data.address;

    }
    catch (error) {

        console.error(
            "Session error:",
            error
        );

    }

}


/* =====================================================
   LOAD TRANSACTIONS
===================================================== */

async function loadTransactions() {

    try {

        transactionList.innerHTML =
            loadingView();


        const response =
            await fetch(
                `${API_BASE}/transactions/${address}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load transaction history."
            );

        }


        const data =
            await response.json();


        transactions =
            data.transactions || [];


        updateSummary();


        renderTransactions();


    }
    catch (error) {

        console.error(
            error
        );


        transactionList.innerHTML =
            emptyView(
                "Transaction history unavailable",
                "Make sure the AUREX backend is running."
            );

    }

}


/* =====================================================
   UPDATE SUMMARY
===================================================== */

function updateSummary() {

    const sent =
        transactions.filter(
            function (tx) {

                return (
                    tx.from &&
                    tx.from.toLowerCase() ===
                    address.toLowerCase()
                );

            }
        );


    const received =
        transactions.filter(
            function (tx) {

                return (
                    tx.to &&
                    tx.to.toLowerCase() ===
                    address.toLowerCase()
                );

            }
        );


    totalTransactions.textContent =
        transactions.length;


    sentTransactions.textContent =
        sent.length;


    receivedTransactions.textContent =
        received.length;

}


/* =====================================================
   RENDER
===================================================== */

function renderTransactions() {

    if (
        transactions.length ===
        0
    ) {

        transactionList.innerHTML =
            emptyView(
                "No transactions yet",
                "Send or receive Sepolia ETH and your activity will appear here."
            );

        return;

    }


    transactionList.innerHTML =
        "";


    transactions.forEach(
        function (
            tx
        ) {

            const isSent =
                tx.from &&
                tx.from.toLowerCase() ===
                address.toLowerCase();


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
                        ${isSent ? "To: " : "From: "}
                        ${shortenAddress(otherAddress)}
                    </small>

                    <small>
                        ${formatDate(tx.timestamp)}
                    </small>

                </div>


                <div class="transaction-amount">

                    <strong
                        class="${isSent
                            ? "negative"
                            : "positive"}">

                        ${isSent ? "-" : "+"}${amount} ETH

                    </strong>

                    <small>
                        ${formatStatus(tx.status)}
                    </small>

                </div>


                <button
                    class="view-button">

                    View

                </button>

            `;


            const viewButton =
                card.querySelector(
                    ".view-button"
                );


            viewButton.addEventListener(
                "click",
                function () {

                    openTransaction(
                        tx,
                        isSent
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
   OPEN TRANSACTION
===================================================== */

function openTransaction(
    tx,
    isSent
) {

    detailStatus.textContent =
        formatStatus(
            tx.status
        );


    detailStatus.style.color =
        tx.status === "failed"
            ? "#d9534f"
            : "#53a96e";


    detailAmount.textContent =
        `${Number(
            tx.valueEth || 0
        ).toFixed(6)} ETH`;


    detailFrom.textContent =
        tx.from || "-";


    detailTo.textContent =
        tx.to || "-";


    detailDate.textContent =
        formatDate(
            tx.timestamp
        );


    detailHash.textContent =
        tx.hash || "-";


    explorerLink.href =
        `${SEPOLIA_EXPLORER}${tx.hash}`;


    transactionModal.classList.add(
        "show"
    );

}


/* =====================================================
   REFRESH
===================================================== */

refreshButton.addEventListener(
    "click",
    async function () {

        await loadTransactions();

    }
);


/* =====================================================
   COPY
===================================================== */

copyAddress.addEventListener(
    "click",
    async function () {

        if (!address) {
            return;
        }


        try {

            await navigator.clipboard.writeText(
                address
            );


            copyAddress.textContent =
                "✓ Copied";


            setTimeout(
                function () {

                    copyAddress.textContent =
                        "⧉ Copy";

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
   CLOSE MODAL
===================================================== */

closeModal.addEventListener(
    "click",
    function () {

        transactionModal.classList.remove(
            "show"
        );

    }
);


/* =====================================================
   CLICK OUTSIDE
===================================================== */

window.addEventListener(
    "click",
    function (
        event
    ) {

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
   BACK TO WALLET
===================================================== */

backWallet.addEventListener(
    "click",
    function () {

        window.location.href =
            "wallet.html";

    }
);


/* =====================================================
   HELPERS
===================================================== */

function shortenAddress(
    value
) {

    if (!value) {
        return "-";
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


function loadingView() {

    return `

        <div class="loading-box">

            <div class="loading-icon">
                ◌
            </div>

            <strong>
                Loading transactions...
            </strong>

            <p>
                Checking the Sepolia blockchain.
            </p>

        </div>

    `;

}


function emptyView(
    title,
    message
) {

    return `

        <div class="loading-box">

            <div class="loading-icon">
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