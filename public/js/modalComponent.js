const modalComponent = {
    data() {
        return {
            //there is then the url, title, etc. ...
            selectedImageData: {},
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
                console.log(response);
                this.selectedImageData = response;
            })
            .catch((err) => {
                console.log(err);
            });
    },

    methods: {
        parentCloseModal() {
            // to inform parent to do sth, we EMIT a keyword
            this.$emit("closeModal");
        },
    },

    template: `
                <div id="myModal" class="modal">
                    <div class="modal-content">
                        <span class="close" @click="parentCloseModal" >&times;</span>
                        <img id="selectedImg" v-bind:src="selectedImageData.url" alt="Imagination" />
                        <p>{{selectedImageData.title}}</p>
                        <p>{{selectedImageData.description}}</p>
                        <p>Posted by {{selectedImageData.username}} on {{selectedImageData.created_at}}</p>
                    </div>
                </div>`,
};

export default modalComponent;
