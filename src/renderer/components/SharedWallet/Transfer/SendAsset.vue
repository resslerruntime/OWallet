<style scoped>
.label {
    font-weight: bold;
    position: relative;
    font-family: 'AvenirNext-Bold';
    color: #5E6369;
    font-size:1.25rem;
    margin:0;
}
.select-asset {
    width:calc(100% - 4rem);
    margin-top:12px;
    margin-bottom: 24px;
    margin-left: 4rem;
}
.input-amount {
    margin-bottom:24px;
    padding-left: 4rem;
}


.fee-label {
    height: 36px;
    line-height: 36px;
    margin:0;
}
.fee-select {
    margin-bottom:50px;
    padding-left: 4rem;
}
.recipient-input {
    padding-left: 4rem;
}
.error-to {
    border-color:red;
}
</style>
<template>
    <div class=" clearfix">
        <p class="label">{{$t('sharedWalletHome.send')}}</p>
        <a-select v-model="asset" @change="changeAsset" class="select-asset">
                <a-select-option value="ONT">ONT</a-select-option>
                <a-select-option value="ONG">ONG</a-select-option>             
        </a-select> 
        <a-input-search :placeholder="$t('sharedWalletHome.amount')" class="input-amount"
        @search="maxAmount" :enterButton="$t('sharedWalletHome.max')" v-model="amount" type="number"/>
        

        <a-row class="fee-select">
            <a-col :span="2">
                <label class="fee-label font-medium">Fee:</label>
            </a-col>
            <a-col :span="16">
                <a-slider :min="0.01" :max="0.1" v-model="gas" :step="0.002" />
            </a-col>
            <a-col :span="6">
                <a-input-number
                    :min="0.01"
                    :max="0.1"
                    :step="0.002"
                    v-model="gas"
                    style="width:60px;margin-right:10px;margin-left:10px;"
                />
                <label class="font-medium">ONG</label>
            </a-col>
      </a-row>

      <p class="label">{{$t('sharedWalletHome.to')}}</p>
      <div class="recipient-input">
        <a-input v-model="to" class="input" :class="validToAddress? '': 'error-to' "
        :placeholder="$t('sharedWalletHome.recipient')" @change="validateToAddress"></a-input>
      </div>

      <div class="footer-btns">
          <div class="footer-btn-container">
            <a-button type="default"  class="btn-cancel" @click="cancel">{{$t('sharedWalletHome.cancel')}}</a-button>
            <a-button type="primary" class="btn-next" @click="next">{{$t('sharedWalletHome.next')}}</a-button>
          </div>
          
      </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    name: 'SendAsset',
    data(){
        return {
            gas: 0.01,
            asset:'ONT',
            amount: 0,
            to:'',
            validToAddress: true
        }
    },
    computed: {
        ...mapState({
            balance: state => state.CurrentWallet.transfer.balance
        })
    },
    mounted() {
        const transfer = this.$store.state.CurrentWallet.transfer
        this.gas = transfer.gas;
        this.asset = transfer.asset;
        this.amount = transfer.amount;
        this.to = transfer.to;
    },

    methods: {
        validateToAddress() {
            if(!this.to || this.to.length !== 34 || this.to[0] !== 'A') {
                this.validToAddress = false;
            }
            this.validToAddress = true;
        },
        changeAsset(value) {
            console.log(value)
        },
        maxAmount() {
            if(this.asset === 'ONT') {
                this.amount = this.balance.ont;
            } else {
                this.amount = this.balance.ong;
            }
        },
        cancel() {
            this.$store.commit('CLEAR_CURRENT_TRANSFER')
            this.$emit('cancelEvent');
        },
        next() {
            if(this.amount && this.to) {
                const transfer = {
                    amount: this.amount,
                    to: this.to,
                    gas: this.gas,
                    asset: this.asset
                }
                this.$store.commit('UPDATE_TRANSFER', {transfer})
                this.$emit('sendAssetNext')
            }
        },
    }
}
</script>


