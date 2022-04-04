const commentsComponent = {
    data() {
        return {
            comments: [],
            username: "",
            comment: "",
        };
    },

    props: ["commentImageId"],

    mounted() {
        //console.log("Yeah finally at commentsComponent, ", this.commentImageId);
        fetch(`/comments/${this.commentImageId}`)
            .then((res) => res.json())
            .then((response) => {
                console.log(response);
                for (let obj of response) {
                    obj.created_at = obj.created_at.toString().slice(0, 10);
                }
                this.comments = response;
            })
            .catch((err) => {
                console.log("error first rendering images: ", err);
            });
    },

    methods: {
        clickPostComment: function () {
            //not needed -> handle this in the database with "not null"
            // if (this.username.length == 0 || this.comment.length == 0) {
            //     return; }
            fetch("/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    imageId: this.commentImageId,
                    username: this.username,
                    comment: this.comment,
                }),
            })
                .then((res) => res.json())
                .then((response) => {
                    //console.log("response: ", response);
                    response.created_at = response.created_at
                        .toString()
                        .slice(0, 10);
                    this.comments.push(response);
                    //reset form fields
                    this.username = "";
                    this.comment = "";
                })
                .catch((err) => {
                    console.log("err submit comment to image: ", err);
                });
        },
    },

    template: `
                <div class="commentsComponentContainer">
                    <p id="headline-comment-section"> COMMENTS | SECTION </p>
                    <form >
                        <input v-model="username" type="text" name="username" placeholder="Username" />
                        <input v-model="comment" type="text" name="comment" placeholder="Comment" />
                        <button @click.prevent="clickPostComment">Submit</button>
                    </form>

                    <div class="commentsContainer">
                        <div class="one-comment" v-for="comment in comments">
                            <p>{{comment.username}} <span id="posted-at">posted on {{comment.created_at}}</span></p>
                            <p>{{comment.comment}}</p>
                            
                        </div>
                     </div> 

                </div>`,
};

export default commentsComponent;
