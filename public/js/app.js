import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            images: [],
            username: "",
            title: "",
            description: "",
            file: null,
        };
    },

    mounted() {
        // console.log("this", this);
        fetch("/images")
            .then((res) => res.json())
            .then((response) => {
                console.log(response);
                this.images = response.reverse();
            })
            .catch((err) => {
                console.log("error first rendering images: ", err);
            });
    },

    methods: {
        fileSelectHandler: function (e) {
            //console.log(e);
            this.file = e.target.files[0];
        },
        clickHandler: function () {
            //need to do it like this to send files!!!
            //the rest(for body) we just send "in addition"
            //if we dont sent a file it wont work! -> see encouter "fetch"
            //we would do it the usual way with defining an object body etc
            const fd = new FormData();
            fd.append("username", this.username);
            fd.append("title", this.title);
            fd.append("description", this.description);
            fd.append("file", this.file);
            //console.log(...fd);

            fetch("/upload", {
                method: "POST",
                body: fd,
            })
                .then((res) => res.json())
                .then((response) => {
                    console.log("response: ", response);
                    this.images.unshift(response[0]);

                    //reset form fields
                    this.username = "";
                    this.title = "";
                    this.description = "";
                    this.$refs.fileupload.value = null;
                })
                .catch((err) => {
                    console.log("err submit formfields or upload image: ", err);
                });
        },
    },
}).mount("#main");
