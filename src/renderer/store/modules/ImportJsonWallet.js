import { Wallet, Account, Crypto } from "ontology-ts-sdk";

const state = {
  currentStep: 0,
  label: "",
  address: "",
  publicKey: "",
  account: "",
  downloadContent: ""
};

const mutations = {
  CREATE_JSON_WALLET(state, payload) {
    state.label = payload.label;
    state.account = payload.account;
    state.downloadContent = payload.content;
    state.address = payload.account.address;
    state.publicKey = payload.account.publicKey;
  },
  INIT_JSON_WALLET(state, payload) {
    state.currentStep = 0;
    state.label = "";
    state.account = "";
    state.downloadContent = "";
    state.address = "";
    state.publicKey = "";
  }
};

const actions = {
  importJsonWalletWithMnemonic({ commit }, body) {
    let wallet = Wallet.create(body.label || "");
    wallet.scrypt.n = 16384;

    let params = {
      cost: 16384,
      blockSize: 8,
      parallel: 8,
      size: 64
    };

    let account = Account.create(
      body.privateKey,
      body.password,
      body.label,
      params
    );
    account.isDefault = true;

    // 生成下载钱包的内容
    wallet.addAccount(account);
    account = account.toJsonObj();
    commit("CREATE_JSON_WALLET", {
      label: body.label,
      account: account,
      content: wallet.toJsonObj()
    });

    return account;
  }
};

export default {
  state,
  mutations,
  actions
};
