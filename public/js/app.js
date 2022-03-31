import * as Vue from "./vue.js";
import modalComponent from "./modalComponent.js";

Vue.createApp({
    data() {
        return {
            images: [],
            username: "",
            title: "",
            description: "",
            file: null,
            selectedImage: null,
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

    components: {
        "modal-component": modalComponent,
    },

    methods: {
        hideModalComponent() {
            // set the cond of v-if to falsy
            console.log("Whatsup");
            this.selectedImage = null;
        },
        selectAnImageAndShowModal(ImageIdClicked) {
            // user selected an image, store it for later truthy render component/modal
            console.log("ImageIdClicked:", ImageIdClicked);
            this.selectedImage = ImageIdClicked;
        },
        fileSelectHandler: function (e) {
            //console.log(e);
            this.file = e.target.files[0];
        },
        clickHandler: function () {
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
                    this.images.unshift(response);

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
