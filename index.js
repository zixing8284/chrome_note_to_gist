// todo:管理应用的生命周期
class Github {
    // 整个index.html string
    // notesource = document.documentElement.outerHTML;
    // #dodo string
    notesource = document.getElementById("dodo").innerHTML;

    // access_token
    token = "";
    // gist_id
    gist_id = "";

    raw = {};
    requestOptions = {};
    constructor() {
        this.gist_id = app.gist_id;
        this.token = app.token;
    }
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
                // app.pulled = result.files["index.html"].content;
                Vue.prototype.$puluing = result.files["index.html"].content;
                // console.log(Vue.prototype.$puluing);
                // console.log(app.$puluing);
                document.getElementById("dodo").innerHTML = app.$puluing;

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
    data() {
        return {
            list1: [1, 2, 3, 4, 5, 6],

            pulled: null,
            gist_id: "",
            token: "",
            ButtonDisabled: false,
            is_loading: false
        }
    },
    beforeCreate() {
        Vue.prototype.$puluing = "";
    },
    created() {
        // 检查remember me
        console.log("abc");
        chrome.storage.local.get("validation",(response) => {
            if(response.validation) {
                this.gist_id = response.validation[1];
                this.token = response.validation[0];
                console.log(this.gist_id);
            }
            else {
                // pass
            };
        });
        console.log(this.gist_id);
    },
    mounted() {
        console.log("def");
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
            if(!this.pulled){
                let github = new Github();
                github.fetch_get(true);
                this.pulled = true;
            };

        },
        rememberMe() {
            // 缓存gistid, token
            chrome.storage.local.get("validation", (response) => {
                if(!response.validation) {
                    response.validation = [];
                    response.validation.push(this.token,this.gist_id);
                    chrome.storage.local.set(response);
                    this.ButtonDisabled = true;
                }
                else {
                    // pass
                };
            })
        },
        clearStorage(){
            chrome.storage.local.clear();
            this.ButtonDisabled = false;
            this.gist_id="";
            this.token="";
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
