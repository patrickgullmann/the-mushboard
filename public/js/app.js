import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            images: [],
        };
    },

    mounted() {
        // console.log("this", this);
        fetch("/images")
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
                this.images = data;
            });
    },

    methods: {
        sayHello: function () {
            console.log(` Hello <3`);
        },
    },
}).mount("#main");
