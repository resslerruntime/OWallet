<template>
  <div id="wrapper">
    <main>
      <div class="left-side">
        <router-link to="Wallets" class="backBtn">
          Back
        </router-link>
        <div class="doc">
          <div class="title">Login with Ledger</div>
          <button :disabled="ledgerStatus!==''" @click="login">Login</button>
          <br><br>
          <p style="color: red;">{{ ledgerStatus }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import {getDeviceInfo, getPublicKey} from '../../../core/ontLedger'

  const interval = 3000;
  export default {
    name: 'LoginLedger',
    created: function () {
      var that = this;
      this.intervalId = setInterval(() => {
        that.getDevice()
      }, interval)
      console.log('created.')
    },
    beforeDestroy: function () {
      clearInterval(this.intervalId);
    },
    data() {
      return {
        intervalId: 0,
        ledgerStatus: '',
        device: null,
        publicKey: ''
      }
    },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link)
      },
      goBack() {
        this.$router.push({name: 'Wallets'})
      },
      getDevice() {
        getDeviceInfo().then(res => {
          console.log('device: ' + res)
          this.device = res;
          this.getPublicKey()
        }).catch(err => {
          console.log(err)
          if (err === 'NOT_FOUND') {
            this.ledgerStatus = 'USB not found.'
          } else if (err === 'NOT_SUPPORT') {
            this.ledgerStatus = 'Ledger not supported.'
          } else {
            this.ledgerStatus = 'Please plugin device to login.'
          }
        })
      },
      getPublicKey() {
        getPublicKey().then(res => {
          console.log('pk info: ' + res);
          this.publicKey = res
          this.ledgerStatus = ''
        }).catch(err => {
          this.ledgerStatus = err.message
        })
      },
      login() {
        if (!this.device || !this.publicKey) {
          console.log('no device.')
          return;
        }
        this.$store.dispatch('loginWithLedger', this.publicKey).then(res => {
          if (res) {
            this.$router.push({name: 'Dashboard'})
          }
        });
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Source Sans Pro', sans-serif;
  }

  #wrapper {
    /* background: radial-gradient(
      ellipse at top left,
      rgba(255, 255, 255, 1) 40%,
      rgba(229, 229, 229, .9) 100%
    ); */
    height: 100vh;
    padding: 60px 80px;
    /* width: 100vw; */
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div {
    flex-basis: 50%;
  }

  .left-side {
    display: flex;
    flex-direction: column;
    margin-top: 80px;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 0.1em;
    min-width: 120px;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .backBtn {

  }
</style>
