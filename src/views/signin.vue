<template>
  <div>
    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-col>
          <v-card max-width="400px" class="mx-auto pa-5">
            <v-text-field
              v-model="name"
              label="Name"
              color="deep-purple accent-4"
            ></v-text-field>
            <v-text-field
              v-model="phone"
              label="Phone no"
              color="deep-purple accent-4"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              color="deep-purple accent-4"
              :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="() => (value = !value)"
              :type="value ? 'password' : 'text'"
            ></v-text-field>

            <v-text-field
              v-model="otp"
              label="Enter Otp"
              color="deep-purple accent-4"
            ></v-text-field>

            <v-btn
              class="deep-purple accent-4 white--text"
              @click="btn ? doRegister() : doConfirm()"
              v-text="btn ? 'Send Otp' : 'Register'"
              :disabled="btnDisabled"
            >
            </v-btn>
            <p class="my-3">
              Already registered?
              <v-btn
                small
                class="deep-purple accent-4 white--text"
                @click="$router.push('/login')"
              >
                Login
              </v-btn>
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
const axios = require("axios");
export default {
  name: "Register",
  components: {},
  data: () => ({
    password: null,
    otp: null,
    phone: null,
    value: true,
    name: null,
    btn: true,
    btnDisabled: false
  }),
  watch: {},
  mounted() {},
  methods: {
    doRegister() {
      this.btnDisabled = true
      const form = {
        name: this.name,
        phone: this.phone,
        password: this.password,
      };
      axios.post(this.$hostname + "/auth/otp", form).then((response) => {
        console.log(response);
        if (response.data.status) {
          this.btn = false;
          this.btnDisabled = false
          this.$vToastify.success(response.data.message);
        } else {
          this.btnDisabled = false
          this.$vToastify.error(response.data.message);
        }
      });
    },

    doConfirm() {
      this.btnDisabled = true
      const form = {
        name: this.name,
        phone: this.phone,
        password: this.password,
        otp: this.otp,
      };
      axios.post(this.$hostname + "/auth/register", form).then((response) => {
        if (response.data.status) {
          this.btnDisabled = false
          this.$vToastify.success(response.data.message);
          this.$router.push("/login");
        } else {
          this.btnDisabled = false
            this.name = null;
            this.otp = "";
            this.phone = "";
            this.password = "";
            this.$vToastify.error(response.data.message);
        }
      });
    },
  },
};
</script>

<style></style>
