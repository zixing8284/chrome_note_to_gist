class Github {
    // 整个index.html string
    notesource = document.documentElement.outerHTML;
    // access_token
    token = "4942bcac29be72a6700c9c0bdda3b18a23e3d915";
    // gist_id
    gist_id = "63bd25acc35e771c1ede16ae1b5b53e3";

    raw = {};
    requestOptions = {};
    // pulled = null;
    // 需要发送的gist内容格式
    set_raw(description, content) {
        this.raw = JSON.stringify({
            "description": description,
            "public": true,
            "files": {
                "index.html": {
                    "content": content
                }
            }
        });
        return this.raw;
    }
    // 构造请求需要的格式
    set_requestOptions(method = 'POST', description = "My Chrome Note", content = this.notesource) {
        this.requestOptions = {
            method: method,
            headers: {
                "Authorization": `token ${this.token}`,
                "Content-Type": "application/json"
            },
            body: this.set_raw(description, content),
            redirect: 'follow'
        };
        return this.requestOptions;
    }

    // 新建,上传至新的gist
    fetch_upload() {
        fetch("https://api.github.com/gists", this.set_requestOptions())
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }
    // 更新存在的gist
    fetch_update() {
        fetch(`https://api.github.com/gists/${this.gist_id}`, this.set_requestOptions('PATCH'))
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }
    // 获取存在的gist
    async fetch_get(flag = true) {
        try {
            const response = await fetch(`https://api.github.com/gists/${this.gist_id}`, { method: 'GET' });
            const result = await response.json();
            if (flag == true) {
                app.pulled = result.files["index.html"].content;
                console.log(app.pulled)
                // this.pulled = result;
            }
            return result;
        }
        catch (error) {
            return console.log('error', error);
        }
    }
}


const app = new Vue({
    el: "#app",
    // data: {
    //     list1: [1, 2, 3, 4, 5, 6],
    //     pulled: null
    // },
    data() {
        return {
            list1: [1, 2, 3, 4, 5, 6],
            pulled: null,
            gist_id: null,
            token: null
        }
    },
    methods: {
        createData() {
            let github = new Github();
            github.fetch_upload();
        },
        updateData() {
            let github = new Github();
            github.fetch_update();
        },
        getData() {
            let github = new Github();
            github.fetch_get(true);
            // this.pulled = github.pulled;
            if (this.pulled) {
                console.log('access')
            };

        },
        handleInput($event) {
            this.list1[index] = $event.target.innerText;
            console.log(this.list1);
        },
        addNewList($event) {
            this.list1.push($event.target.value)
            console.log(this.list1)
        }
    }
})
