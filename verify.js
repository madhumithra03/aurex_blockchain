/* =====================================================
   AUREX RECOVERY PHRASE VERIFICATION
===================================================== */

const verifyPhrase =
    document.getElementById("verifyPhrase");

const verifyButton =
    document.getElementById("verifyButton");

const verifyStatus =
    document.getElementById("verifyStatus");


/* =====================================================
   CHECK PENDING WALLET
===================================================== */

const pendingWallet =
    sessionStorage.getItem(
        "aurexPendingWallet"
    );


if (!pendingWallet) {

    verifyStatus.style.color =
        "#d9534f";

    verifyStatus.textContent =
        "No wallet is waiting for verification.";

    verifyButton.disabled = true;

}


/* =====================================================
   VERIFY PHRASE
===================================================== */

verifyButton.addEventListener(
    "click",
    function () {

        try {

            if (!pendingWallet) {
                return;
            }


            const walletInfo =
                JSON.parse(
                    pendingWallet
                );


            const phrase =
                verifyPhrase.value.trim();


            /* EMPTY */

            if (!phrase) {

                showError(
                    "Please enter your 12-word recovery phrase."
                );

                return;
            }


            /* WORD COUNT */

            const words =
                phrase.split(/\s+/);


            if (words.length !== 12) {

                showError(
                    "The recovery phrase must contain exactly 12 words."
                );

                return;
            }


            /*
                Recreate wallet from phrase.
            */

            const recoveredWallet =
                ethers.Wallet.fromPhrase(
                    phrase
                );


            /*
                Compare addresses.

                If the address matches,
                the phrase belongs to the
                wallet just created.
            */

            if (
                recoveredWallet.address.toLowerCase() !==
                walletInfo.address.toLowerCase()
            ) {

                showError(
                    "The phrase does not match this wallet."
                );

                return;
            }


            /* SUCCESS */

            verifyStatus.style.color =
                "#4b9b67";

            verifyStatus.textContent =
                "✓ Recovery phrase verified successfully.";


            /*
                Create dashboard session.
            */

            sessionStorage.setItem(
                "aurexWalletSession",
                JSON.stringify({

                    address:
                        recoveredWallet.address,

                    publicKey:
                        recoveredWallet.signingKey.publicKey,

                    verified: true

                })
            );


            /*
                Remove temporary data.
            */

            sessionStorage.removeItem(
                "aurexPendingWallet"
            );


            /*
                Open new wallet site.
            */

            setTimeout(
                function () {

                    window.location.href =
                        "wallet.html";

                },
                900
            );

        }

        catch (error) {

            console.error(error);

            showError(
                "Invalid recovery phrase."
            );

        }

    }
);


/* =====================================================
   ERROR
===================================================== */

function showError(message) {

    verifyStatus.style.color =
        "#d9534f";

    verifyStatus.textContent =
        message;

}