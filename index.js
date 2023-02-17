$( document ).ready(async function() {
    if(await IsLogin()) {
        RedirectToUrl("./views/home.html");
    }
    
    //localStorage.clear();
    var CodeEncrypter = localStorage.getItem("CodeEncrypter");

    //#region JS
    let form = document.getElementById("form-login");
    let formCode = document.getElementById("form-code");
    let txtCode = document.getElementById("txt-code");
    txtCode.value = CodeEncrypter;

    form.addEventListener("submit", async function(event){
        event.preventDefault();

        const Data = SerializeForm(this);
        const Users = await GetTable("Users");

        const UserName = Encrypt(CodeEncrypter, Data.UserName.toUpperCase());
        const Password = Encrypt(CodeEncrypter, Data.Password);

        const FindUser = Users.find(c=>c.UserName == UserName && c.Password == Password);
        if(FindUser == undefined) {
            ShowModalMessage("Usuario y/o contraseña incorrecta", "error");
            return;
        }
        
        localStorage.setItem("UserId", FindUser.UserId);
        ShowMessage("Se inicio de sesión correctamente", "success", "top-end");
        RedirectToUrl("./views/home.html");
    });
    
    formCode.addEventListener("submit", async function(event){
        event.preventDefault();

        const Data = SerializeForm(this);
        CodeEncrypter = Data.Code;
        localStorage.setItem("CodeEncrypter", CodeEncrypter);
        ShowModalMessage("Codigo actualizado correctamente", "success");
    });
    //#endregion

});