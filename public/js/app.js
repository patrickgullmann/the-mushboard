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
        if (location.pathname.slice(1)) {
            this.selectedImage = location.pathname.slice(1);
        }

        window.addEventListener("popstate", () => {
            // console.log("the user just used the forward or backward button!");
            // console.log("url updated to:", location.pathname.slice(8));
            this.selectedImage = location.pathname.slice(1);
        });

        // console.log("this", this);
        fetch("/images")
            .then((res) => res.json())
            .then((response) => {
                console.log(response);
                //handled now in db so no response.reverse()
                this.images = response;
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
            //console.log("Whatsup");
            this.selectedImage = null;
            history.pushState({}, "", "/");
        },
        selectAnImageAndShowModal(ImageIdClicked) {
            // user selected an image, store it for later truthy render component/modal
            console.log("ImageIdClicked:", ImageIdClicked);
            this.selectedImage = ImageIdClicked;
            history.pushState({}, "", `/${ImageIdClicked}`);
        },
        fileSelectHandler: function (e) {
            //console.log(e);
            this.file = e.target.files[0];
        },
        clickPostImageHandler: function () {
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
        clickShowMoreImagesHandler: function () {
            let lowestId = null;
            //for ... of und nicht for ... in da array?
            for (let image of this.images) {
                console.log(image.id);
                //um den ersten Wert als Starter zu setzen
                if (lowestId) {
                    if (image.id < lowestId) {
                        lowestId = image.id;
                    }
                } else {
                    lowestId = image.id;
                }
            }
            //console.log(lowestId);

            fetch(`/moreimages/${lowestId}`)
                .then((res) => res.json())
                .then((response) => {
                    for (let obj of response) {
                        this.images.push(obj);
                    }
                    //hide more button if no more pictures available
                    for (let image of this.images) {
                        if (image.id === response[0].lowestId) {
                            document.getElementById(
                                "moreButton"
                            ).style.visibility = "hidden";
                        }
                    }
                    //console.log(this.images);
                })
                .catch((err) => {
                    console.log("err showing more images: ", err);
                });
        },
    },
}).mount("#main");
