/* =====================================================
   AUREX BACKEND
   Ethereum Sepolia
===================================================== */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");


/* =====================================================
   CONFIGURATION
===================================================== */

const PORT =
    Number(process.env.PORT) || 5000;

const SEPOLIA_CHAIN_ID =
    11155111;

const SEPOLIA_RPC_URL =
    process.env.SEPOLIA_RPC_URL;


/* =====================================================
   VALIDATE ENVIRONMENT
===================================================== */

if (!SEPOLIA_RPC_URL) {

    console.error(
        "ERROR: SEPOLIA_RPC_URL is missing."
    );

    process.exit(1);

}


/* =====================================================
   EXPRESS APP
===================================================== */

const app =
    express();


app.use(
    cors()
);


app.use(
    express.json({
        limit: "200kb"
    })
);


/* =====================================================
   SEPOLIA PROVIDER
===================================================== */

const provider =
    new ethers.JsonRpcProvider(
        SEPOLIA_RPC_URL,
        {
            name: "sepolia",
            chainId: SEPOLIA_CHAIN_ID
        }
    );


/* =====================================================
   HELPER
===================================================== */

function isValidAddress(
    address
) {

    return (
        typeof address === "string" &&
        ethers.isAddress(address)
    );

}


/* =====================================================
   ROOT
===================================================== */

app.get(
    "/",
    function (req, res) {

        res.json({

            application:
                "AUREX Backend",

            status:
                "running",

            network:
                "Ethereum Sepolia",

            chainId:
                SEPOLIA_CHAIN_ID

        });

    }
);


/* =====================================================
   HEALTH CHECK
===================================================== */

app.get(
    "/api/health",
    async function (req, res) {

        try {

            const network =
                await provider.getNetwork();


            res.json({

                success:
                    true,

                status:
                    "healthy",

                network:
                    "Ethereum Sepolia",

                chainId:
                    Number(
                        network.chainId
                    )

            });

        }

        catch (error) {

            console.error(
                "HEALTH ERROR:",
                error
            );


            res.status(500).json({

                success:
                    false,

                status:
                    "unavailable",

                error:
                    "Unable to connect to Sepolia RPC."

            });

        }

    }
);


/* =====================================================
   NETWORK
===================================================== */

app.get(
    "/api/network",
    async function (req, res) {

        try {

            const network =
                await provider.getNetwork();


            const chainId =
                Number(
                    network.chainId
                );


            if (
                chainId !==
                SEPOLIA_CHAIN_ID
            ) {

                return res.status(500).json({

                    success:
                        false,

                    error:
                        "Connected network is not Sepolia.",

                    chainId

                });

            }


            res.json({

                success:
                    true,

                network:
                    "Ethereum Sepolia",

                chainId:
                    SEPOLIA_CHAIN_ID

            });

        }

        catch (error) {

            console.error(
                "NETWORK ERROR:",
                error
            );


            res.status(500).json({

                success:
                    false,

                error:
                    "Unable to connect to Ethereum Sepolia."

            });

        }

    }
);


/* =====================================================
   RPC PROXY
===================================================== */

app.post(
    "/api/rpc",
    async function (req, res) {

        try {

            const body =
                req.body;


            if (!body || !body.method) {

                return res.status(400).json({

                    error:
                        "Invalid JSON-RPC request."

                });

            }


            const response =
                await fetch(
                    SEPOLIA_RPC_URL,
                    {

                        method:
                            "POST",

                        headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(body)

                    }
                );


            const data =
                await response.json();


            res
                .status(response.status)
                .json(data);

        }

        catch (error) {

            console.error(
                "RPC PROXY ERROR:",
                error
            );


            res.status(500).json({

                error:
                    "Sepolia RPC request failed."

            });

        }

    }
);


/* =====================================================
   BALANCE
===================================================== */

app.get(
    "/api/balance/:address",
    async function (req, res) {

        try {

            const address =
                req.params.address;


            if (
                !isValidAddress(
                    address
                )
            ) {

                return res.status(400).json({

                    success:
                        false,

                    error:
                        "Invalid Ethereum address."

                });

            }


            const balance =
                await provider.getBalance(
                    address
                );


            const balanceEth =
                ethers.formatEther(
                    balance
                );


            res.json({

                success:
                    true,

                address:
                    address,

                balance:
                    Number(
                        balanceEth
                    ),

                balanceWei:
                    balance.toString(),

                network:
                    "Ethereum Sepolia"

            });

        }

        catch (error) {

            console.error(
                "BALANCE ERROR:",
                error
            );


            res.status(500).json({

                success:
                    false,

                error:
                    "Unable to read Sepolia balance."

            });

        }

    }
);


/* =====================================================
   TRANSACTION PREVIEW
===================================================== */

app.post(
    "/api/transaction/validate",
    async function (req, res) {

        try {

            const {
                from,
                to,
                amount
            } = req.body;


            /* FROM */

            if (
                !isValidAddress(
                    from
                )
            ) {

                return res.status(400).json({

                    success:
                        false,

                    error:
                        "Invalid sender address."

                });

            }


            /* TO */

            if (
                !isValidAddress(
                    to
                )
            ) {

                return res.status(400).json({

                    success:
                        false,

                    error:
                        "Invalid recipient address."

                });

            }


            /* AMOUNT */

            if (
                typeof amount !==
                "string" ||
                amount.trim() === ""
            ) {

                return res.status(400).json({

                    success:
                        false,

                    error:
                        "Transaction amount is required."

                });

            }


            let valueWei;


            try {

                valueWei =
                    ethers.parseEther(
                        amount
                    );

            }

            catch (error) {

                return res.status(400).json({

                    success:
                        false,

                    error:
                        "Invalid ETH amount."

                });

            }


            if (
                valueWei <=
                0n
            ) {

                return res.status(400).json({

                    success:
                        false,

                    error:
                        "Amount must be greater than zero."

                });

            }


            res.json({

                success:
                    true,

                network:
                    "Ethereum Sepolia",

                chainId:
                    SEPOLIA_CHAIN_ID,

                from:
                    ethers.getAddress(
                        from
                    ),

                to:
                    ethers.getAddress(
                        to
                    ),

                amount:
                    amount,

                valueWei:
                    valueWei.toString()

            });

        }

        catch (error) {

            console.error(
                "VALIDATION ERROR:",
                error
            );


            res.status(500).json({

                success:
                    false,

                error:
                    "Transaction validation failed."

            });

        }

    }
);


/* =====================================================
   BROADCAST SIGNED TRANSACTION
===================================================== */

app.post(
    "/api/send-raw",
    async function (req, res) {

        try {

            const {
                signedTransaction
            } = req.body;


            /* =================================================
               CHECK SIGNED TRANSACTION
            ================================================= */

            if (
                typeof signedTransaction !==
                "string"
            ) {

                return res.status(400).json({

                    success:
                        false,

                    error:
                        "Signed transaction is required."

                });

            }


            if (
                !signedTransaction.startsWith(
                    "0x"
                )
            ) {

                return res.status(400).json({

                    success:
                        false,

                    error:
                        "Invalid signed transaction."

                });

            }


            /* =================================================
               PARSE TRANSACTION
            ================================================= */

            const transaction =
                ethers.Transaction.from(
                    signedTransaction
                );


            /* =================================================
               MUST BE SIGNED
            ================================================= */

            if (
                !transaction.isSigned()
            ) {

                return res.status(400).json({

                    success:
                        false,

                    error:
                        "Transaction is not signed."

                });

            }


            /* =================================================
               CHECK CHAIN ID
            ================================================= */

            if (
                transaction.chainId !==
                BigInt(
                    SEPOLIA_CHAIN_ID
                )
            ) {

                return res.status(400).json({

                    success:
                        false,

                    error:
                        "Wrong network. Only Ethereum Sepolia transactions are allowed."

                });

            }


            /* =================================================
               CHECK RECIPIENT
            ================================================= */

            if (
                !transaction.to ||
                !isValidAddress(
                    transaction.to
                )
            ) {

                return res.status(400).json({

                    success:
                        false,

                    error:
                        "Invalid recipient."

                });

            }


            /* =================================================
               THIS PROJECT SENDS ONLY ETH
               No contract/data transactions.
            ================================================= */

            if (
                transaction.data &&
                transaction.data !==
                "0x"
            ) {

                return res.status(400).json({

                    success:
                        false,

                    error:
                        "Only normal ETH transfers are supported."

                });

            }


            /* =================================================
               CHECK VALUE
            ================================================= */

            if (
                transaction.value <=
                0n
            ) {

                return res.status(400).json({

                    success:
                        false,

                    error:
                        "Transaction amount must be greater than zero."

                });

            }


            /* =================================================
               BROADCAST
            ================================================= */

            const tx =
                await provider.broadcastTransaction(
                    signedTransaction
                );


            res.json({

                success:
                    true,

                hash:
                    tx.hash,

                from:
                    tx.from,

                to:
                    tx.to,

                value:
                    ethers.formatEther(
                        tx.value
                    ),

                network:
                    "Ethereum Sepolia",

                chainId:
                    SEPOLIA_CHAIN_ID,

                status:
                    "submitted"

            });

        }

        catch (error) {

            console.error(
                "BROADCAST ERROR:",
                error
            );


            res.status(400).json({

                success:
                    false,

                error:
                    error.shortMessage ||
                    error.message ||
                    "Transaction broadcast failed."

            });

        }

    }
);


/* =====================================================
   TRANSACTION RECEIPT
===================================================== */

app.get(
    "/api/transaction/:hash",
    async function (req, res) {

        try {

            const hash =
                req.params.hash;


            if (
                !/^0x[a-fA-F0-9]{64}$/.test(
                    hash
                )
            ) {

                return res.status(400).json({

                    success:
                        false,

                    error:
                        "Invalid transaction hash."

                });

            }


            const tx =
                await provider.getTransaction(
                    hash
                );


            const receipt =
                await provider.getTransactionReceipt(
                    hash
                );


            if (!tx) {

                return res.json({

                    success:
                        true,

                    found:
                        false,

                    status:
                        "pending-or-not-found"

                });

            }


            let status =
                "pending";


            if (receipt) {

                status =
                    receipt.status === 1
                        ? "confirmed"
                        : "failed";

            }


            res.json({

                success:
                    true,

                found:
                    true,

                hash:
                    tx.hash,

                from:
                    tx.from,

                to:
                    tx.to,

                value:
                    ethers.formatEther(
                        tx.value
                    ),

                blockNumber:
                    receipt
                        ? receipt.blockNumber
                        : null,

                confirmations:
                    receipt
                        ? await tx.confirmations()
                        : 0,

                status:
                    status,

                network:
                    "Ethereum Sepolia"

            });

        }

        catch (error) {

            console.error(
                "RECEIPT ERROR:",
                error
            );


            res.status(500).json({

                success:
                    false,

                error:
                    "Unable to read transaction."

            });

        }

    }
);


/* =====================================================
   TRANSACTION HISTORY
===================================================== */

app.get(
    "/api/transactions/:address",
    async function (req, res) {

        try {

            const address =
                req.params.address;


            if (
                !isValidAddress(
                    address
                )
            ) {

                return res.status(400).json({

                    success:
                        false,

                    error:
                        "Invalid Ethereum address."

                });

            }


            /*
                Sepolia transaction history
                from Blockscout.
            */

            const historyUrl =
                "https://eth-sepolia.blockscout.com" +
                `/api/v2/addresses/${address}/transactions`;


            const response =
                await fetch(
                    historyUrl
                );


            if (!response.ok) {

                throw new Error(
                    `Blockscout returned ${response.status}`
                );

            }


            const data =
                await response.json();


            const items =
                Array.isArray(
                    data.items
                )
                    ? data.items
                    : [];


            const transactions =
                items
                    .slice(0, 20)
                    .map(
                        function (tx) {

                            const from =
                                tx.from &&
                                tx.from.hash
                                    ? tx.from.hash
                                    : "";


                            const to =
                                tx.to &&
                                tx.to.hash
                                    ? tx.to.hash
                                    : "";


                            const valueWei =
                                tx.value ||
                                "0";


                            let valueEth =
                                "0";


                            try {

                                valueEth =
                                    ethers.formatEther(
                                        valueWei
                                    );

                            }

                            catch (error) {

                                valueEth =
                                    "0";

                            }


                            return {

                                hash:
                                    tx.hash,

                                from:
                                    from,

                                to:
                                    to,

                                valueEth:
                                    valueEth,

                                timestamp:
                                    tx.timestamp ||
                                    null,

                                status:
                                    tx.status ||
                                    "confirmed"

                            };

                        }
                    );


            res.json({

                success:
                    true,

                network:
                    "Ethereum Sepolia",

                address:
                    address,

                count:
                    transactions.length,

                transactions:
                    transactions

            });

        }

        catch (error) {

            console.error(
                "HISTORY ERROR:",
                error
            );


            res.status(500).json({

                success:
                    false,

                error:
                    "Unable to load Sepolia transaction history."

            });

        }

    }
);


/* =====================================================
   START SERVER
===================================================== */

app.listen(
    PORT,
    function () {

        console.log(
            "======================================"
        );

        console.log(
            "AUREX BACKEND STARTED"
        );

        console.log(
            `http://localhost:${PORT}`
        );

        console.log(
            "Network: Ethereum Sepolia"
        );

        console.log(
            "Chain ID: 11155111"
        );

        console.log(
            "MetaMask: NOT USED"
        );

        console.log(
            "======================================"

        );

    }
);