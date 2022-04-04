import commentsComponent from "./commentsComponent.js";

const modalComponent = {
    data() {
        return {
            //there is then the url, title, etc. ...
            selectedImageData: {},
            //loaded, da ja wir erst auf die Daten warten müssen
            loaded: false,
        };
    },

    props: ["imageId"],

    mounted() {
        console.log("Id passed to Component:", this.imageId);

        //send in the fetch the info in the route!
        //OR send it via header! NOT in body
        fetch(`/modal/${this.imageId}`)
            .then((res) => res.json())
            .then((response) => {
                //not got false/null from the server
                if (response) {
                    this.selectedImageData = response;
                    this.loaded = true;
                } else {
                    //console.log(response);
                    //if no picture in database close the tried to open modal!
                    this.parentCloseModal();
                    history.replaceState({}, "", "/");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    },

    components: {
        "comments-component": commentsComponent,
    },

    methods: {
        parentCloseModal() {
            // to inform parent to do sth, we EMIT a keyword
            this.$emit("closeModal");
        },
    },

    template: `
                <div v-if="loaded" id="myModal" class="modal">
                    <div class="modal-content">
                        <span class="close" @click="parentCloseModal" >&times;</span>
                        <img id="selectedImg" v-bind:src="selectedImageData.url" alt="Imagination" />
                        <p>Title | {{selectedImageData.title}}</p>
                        <p>Description | {{selectedImageData.description}}</p>
                        <p>Posted by | {{selectedImageData.username}} on {{selectedImageData.created_at}}</p>
                        <comments-component v-bind:comment-image-id="imageId"></comments-component>
                    </div>
                </div>`,
};

export default modalComponent;
