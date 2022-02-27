const key = "HomoPolus";


// ADD USER STRING TO USER STORAGE ARRAY
async function addUser(user){
    
    let res = await fetch("https://codeforces.com/api/user.info?handles="+user);
    let data = await res.json();
    let temp = await data.status;
    
    if(temp == "FAILED") return;
    
    // IF NOT INITIALIZED AND WHEN DELETE ON LENGTH = 1,CLEAR STORAGE\
    if(localStorage.getItem(key) == null){
        
        let arr = []
        arr.push(user);
        localStorage.clear();
        let strArr = JSON.stringify(arr);
        localStorage.setItem(key,strArr);
        returnUsers(); 
        return;
    }
    
    
    let arrayString = localStorage.getItem(key);
    let arr = JSON.parse(arrayString);
    arr.push(user);
    
    localStorage.clear();
    
    let strArr = JSON.stringify(arr);
    localStorage.setItem(key,strArr);
    returnUsers();
}


// LISTENER ON ADD BUTTON
document.getElementById("add").addEventListener("click", () => {
    let inputUser = document.getElementById("input-field").value;
    addUser(inputUser);
})


// CREATES USER STRING OF NEWLY GENERATED ARRAY AND THEN CALLS FOR FETCH
async function returnUsers(){

    // CHANGE
    if(localStorage.getItem(key) == null){
        document.getElementById("cards-div").innerHTML = ``;
        return;
    }

    let arrayString = localStorage.getItem(key);
    let arr = JSON.parse(arrayString);

    let usersString = "";
    let userSet = new Set();

    for(const user of arr){
        userSet.add(user)
    }
    
    for(const user of userSet){
        usersString += user + ";";
    }

    display(usersString);
}

function deleteUser(user){
    console.log(user)
    let arrayString = localStorage.getItem(key);
    let arr = JSON.parse(arrayString);
    let i = 0;
    
    for(const item of arr){
        if(item == user){
            arr.splice(i,1);
        }
        i++;
    }
    console.log(arr);

    localStorage.clear();
    let strArr = JSON.stringify(arr);
    localStorage.setItem(key,strArr);
    returnUsers();
}

async function display(usersString){
    
    let res = await fetch("https://codeforces.com/api/user.info?handles="+usersString);
    let temp = await res.json();
    let resultArray = await temp.result; 
    
    document.getElementById("cards-div").innerHTML = ``;

    for(const x of resultArray){
        
        let fullName = x.firstName + x.lastName;


        document.getElementById("cards-div").innerHTML+= `
        <div class="card">
            <div class="title-section">
                <div class="user-info-section">
                    <div class="user-img-div">
                        <img src="${x.titlePhoto}" alt="" class="user-img">
                    </div>
                    <div class="name-section">
                        <div class="name-div">
                            <h3 class="name">${fullName} </h3>
                        </div>
                        <div class="user-name-div">    
                            <h4 class="user-name">@${x.handle}</h4>
                        </div>
                    </div>
    
                </div>
                
                <div class="bin-section" >
                    <div class="bin-icon">
                    <button id="${x.handle}" style="background-color:#fff0 !important;" class="delete"><img class="deleteIt" src = "deleteImage.png"></button>
                    </div>
                </div>
            </div>
    
            <div class="ratings-section">
    
                <div class="new-rating rating-div">
                    <h2 class="rating-score">${x.rank}</h2>
                    <p>Current Rank</p>
                </div>
                <div class="old-rating rating-div">
                    <h2 class="rating-score">${x.rating}</h2>
                    <p>Current Rating</p>
                </div>
                <div class="max-rating rating-div">
                    <h2 class="rating-score">${x.maxRating}</h2>
                    <p>Max Rating</p>
                </div>
            </div>
        </div>`;

        document.getElementById(x.handle).addEventListener("click", () => {
            deleteUser(x.handle)
        });
    }
}

function hotReload(){
    if(localStorage.getItem(key) != null){
        returnUsers();
    }
} 
            
document.getElementById("clrAll").addEventListener("click", () => {
    localStorage.clear();
    returnUsers();
})

hotReload();
