import { hex } from "../build/main.compiled.json";
import {
    beginCell,
    Cell,
    contractAddress,
    StateInit,
    storeStateInit,
    toNano,
} from "ton";
import qs from "qs";
import dotenv from "dotenv";
import qrcode from "qrcode-terminal";
dotenv.config();

async function deployScript() {
    console.log(
        "================================================================="
    );
    console.log("Deploy script is running, let's deploy our main.fc contract...");

    const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
    const dataCell = new Cell();

    const stateInit: StateInit = {
        code: codeCell,
        data: dataCell,
    };

    const stateInitBuilder = beginCell();
    storeStateInit(stateInit)(stateInitBuilder);
    const stateInitCell = stateInitBuilder.endCell();

    const address = contractAddress(0, {
        code: codeCell,
        data: dataCell,
    });

    console.log(
        `The address of the contract is following: ${address.toString()} will deploy on ${process.env.TESTNET ? "TESTNET" : "MAINET"}`
    );
    console.log(`Please scan the QR code below to deploy the contract:`);

    let link =
        `https://tonhub.com/transfer/` +
        address.toString({
            testOnly: process.env.TESTNET ? true : false,
        }) +
        "?" +
        qs.stringify({
            text: "Deploy contract",
            amount: toNano(1).toString(10),
            init: stateInitCell.toBoc({ idx: false }).toString("base64"),
        });

    qrcode.generate(link, { small: true }, (code) => {
        console.log(code);
    });
}

deployScript();