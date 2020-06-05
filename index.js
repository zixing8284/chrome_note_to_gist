class Github {
    // 整个index.html string
    notesource = document.documentElement.outerHTML;
    raw = JSON.stringify({
        "description": "My Chrome Note",
        "public": true,
        "files": {
            "index.html": {
                "content": this.notesource
            }
        }
    });
    // access_token
    token = "";
    constructor() {
        this.requestOptions = {
            method: 'POST',
            headers: {
                "Authorization": "token " + this.token,
                "Content-Type": "application/json"
            },
            body: this.raw,
            redirect: 'follow'
        };
    }
    // 上传至gist
    fetch_upload() {
        fetch("https://api.github.com/gists", this.requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
}


const app = new Vue({
    el: "#app",
    data: {
        list1:[1,2,3,4,5]
    },
    methods: {
        updateData() {
            let github = new Github();
            github.fetch_upload();
        }
    }
})
