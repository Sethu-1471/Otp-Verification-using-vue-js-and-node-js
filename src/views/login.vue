<template>
  <div>
       <v-container fill-height fluid>
        <v-row align="center" justify="center">
            <v-col>
                <v-card max-width="400px" class="mx-auto pa-5">
                    <v-text-field v-model="phone" label="Phone Number" color="deep-purple accent-4"></v-text-field>
                    <v-text-field v-model="password" label="Password" color="deep-purple accent-4" :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'" @click:append="() => (value = !value)" :type="value ? 'password' : 'text'"></v-text-field>
                    <v-btn class="deep-purple accent-4 white--text" >
                        Login
                    </v-btn>
                    <p class="my-3">create account ? <v-btn small class="deep-purple accent-4 white--text" @click="$router.push('/signin')">
                        Register
                    </v-btn></p>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
  </div>
</template>


<script>
// const axios = require("axios");
export default {
  name: "Login",
  components: {},
  data: () => ({
    password: null,
    phone: null,
    value: true,
    btnDisabled: false
  }),
  watch: {},
  mounted() {},
  methods: {
    
  },
};
</script>


<style>

</style>