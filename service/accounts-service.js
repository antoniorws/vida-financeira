const btnregister = document.querySelector("#registerAccounts")
const nameNewAccount = document.querySelector("#nameNewAccount")
const balanceNewAccount = document.querySelector("#balanceNewAccount")
const accountTypeNewAccount = document.querySelector("#accountType")
const currencyNewAccount = document.querySelector("#currency")
const tableAccounts = document.querySelector("#tableAccounts")
const divNewData = document.querySelector("#div-new-data")
const btnCancel = document.querySelector("#cancelaAtualizacao")

/**
 * @description Verify if user exist
 */
function verifyUser(){
    firebase.auth().onAuthStateChanged( (user) => {
        if (user) {
            init()
        } else {
            console.log('User not logged in!')
        }
    });
}

/**
 * @description Init methods
 */
function init(){
    document.querySelector("#nav-accounts").classList.add("main")
    getAllAccounts()
}

/**
 * @description Load all of tha account from user
 */
function getAllAccounts(){
    while(tableAccounts.childNodes.length > 2){
        tableAccounts.removeChild(tableAccounts.lastChild);
    }
    const response = getAccounts(firebase.auth().currentUser.uid)
    response.then((accounts) => {
        accounts.forEach(account => {
            const accountJSON = {
                "id": account.id,
                "name": account.data().name,
                "accountType": account.data().accountType,
                "currency": account.data().currency,
                "balance": account.data().balance
            }
            updateTable(accountJSON)
        });
    }).catch(error =>{
        alert(error.message);
    })
}

/**
 * 
 * @param {JSON} account 
 * @description Load table
 */
function updateTable(account){
    const tr = document.createElement("TR")
    const tdId = document.createElement("TD")
    const tdName = document.createElement("TD")
    const tdAccountType = document.createElement("TD")
    const tdCurrency = document.createElement("TD")
    const tdBalance = document.createElement("TD")
    const btnDelete = document.createElement("BUTTON")
    const btnUpdate = document.createElement("BUTTON")
    btnDelete.innerText = "Delete"
    btnDelete.classList.add("btn-table")
    btnUpdate.innerText = "Change"
    btnUpdate.classList.add("btn-table")
    tdId.className = account.id
    tdName.className = account.id
    tdId.innerText = account.id
    tdName.innerText = account.name 
    tdAccountType.innerText = account.accountType
    tdCurrency.innerText = account.currency
    tdBalance.innerText = account.balance
    tr.appendChild(tdId)
    tr.appendChild(tdName)
    tr.appendChild(tdAccountType)
    tr.appendChild(tdCurrency)
    tr.appendChild(tdBalance)
    tr.appendChild(btnUpdate)
    tr.appendChild(btnDelete)
    tableAccounts.appendChild(tr)

    btnUpdate.addEventListener("click", () => {
        const tableButtons = document.querySelectorAll("table button")
        for(var i = 0; i < tableButtons.length; i++){
            tableButtons[i].classList.add("disabled-button")
        }

        btnregister.classList.add("hidden-class")
        btnCancel.classList.remove("hidden-class")
        nameNewAccount.value = account.name
        accountTypeNewAccount.value = account.accountType
        currencyNewAccount.value = account.currency
        balanceNewAccount.value = account.balance
        nameNewAccount.focus()

        const btnUpdateAccounts = document.createElement("BUTTON")
        btnUpdateAccounts.innerText = "Update"
        divNewData.appendChild(btnUpdateAccounts)
        btnUpdateAccounts.addEventListener("click", () => {
            const accountJSON = {
                "name": nameNewAccount.value,
                "accountType": accountTypeNewAccount.value,
                "currency": currencyNewAccount.value,
                "balance": balanceNewAccount.value
            }
            updateAccount(firebase.auth().currentUser.uid, account.id, accountJSON)
            tdName.innerText = nameNewAccount.value
            tdCurrency.innerText = currencyNewAccount.value
            tdAccountType.innerText = accountTypeNewAccount.value
            tdBalance.innerText = balanceNewAccount.value
            cancel(btnUpdateAccounts)
            
        })

        btnCancel.addEventListener("click", () => {
            cancel(btnUpdateAccounts)
        })
    })

    btnDelete.addEventListener("click", () => {
        const response = confirm(`Are you sure you want delete account ${account.name} and your movimentations?`);
        if (response == true){
            tr.remove()
            deleteAccount(firebase.auth().currentUser.uid, account.id)
            //TODO delte expenses from account deleted
        }
    })
}

btnregister.addEventListener("click", () => {
    const accountJSON = {
        "name": nameNewAccount.value,
        "accountType": accountTypeNewAccount.value,
        "currency": currencyNewAccount.value,
        "balance": balanceNewAccount.value
    }
    createAccount(firebase.auth().currentUser.uid, accountJSON)
    .then((account) => {
        accountJSON.id = account.id
        updateTable(accountJSON)
    }).catch(error => {
        alert(error.message)
    })
    nameNewAccount.value = ""
    balanceNewAccount.value = ""
    accountTypeNewAccount.value = "CC"
    currencyNewAccount.value = "BRL"
})

/**
 * @description Back to start
 * @param {Button} btnUpdateAccounts 
 */
function cancel(btnUpdateAccounts){
    const tableButtons = document.querySelectorAll("table button")
    btnregister.classList.remove("hidden-class")
    btnUpdateAccounts.remove()
    btnCancel.classList.add("hidden-class")
    nameNewAccount.value = ""
    accountTypeNewAccount.value = "CC"
    currencyNewAccount.value = "BRL"
    balanceNewAccount.value = ""
    for(var i = 0; i < tableButtons.length; i++){
        tableButtons[i].classList.remove("disabled-button")
    }
}

verifyUser(); 