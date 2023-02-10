const CodeEncrypter = localStorage.getItem("CodeEncrypter");

$( document ).ready(async function() {
    if(!await IsLogin()) {
        RedirectToUrl("../index.html");
    }

    //#region JS
    //#region variables

    const User = await GetUser();
    const Role = await GetRole(User.RoleId);

    let btnLogout = document.getElementById("btnLogout");
    let btnChangePassword = document.getElementById("btnChangePassword");
    let tableMain = document.getElementById("tableMain");
    
    var IsEncrypt = true;

    //#endregion

    //#region FUNCIONES AL INICIAR
    await LoadData();
    LoadTable();
    //#endregion

    btnLogout.addEventListener("click", function(event){
        localStorage.removeItem("UserId");
        RedirectToUrl("../index.html");
    });

    btnChangePassword.addEventListener("click", function(event){
        if(IsEncrypt) {
            IsEncrypt = false;
            this.classList.remove("btn-secondary");
            this.classList.add("btn-success");
            this.innerHTML = "Contraseñas visibles";
            ShowMessage("Las contraseñas ahora son visibles", "info", "bottom");
        } else {
            IsEncrypt = true;
            this.classList.remove("btn-success");
            this.classList.add("btn-secondary");
            this.innerHTML = "Contraseñas ocultas";
            ShowMessage("Las contraseñas ahora estan ocultas", "info", "bottom");
        }
        LoadTable();
    });

    async function LoadData() {
        $(".js-UserName").html(Decrypt(CodeEncrypter, User.UserName));
        $(".js-Name").html(Decrypt(CodeEncrypter, User.Name));
        $(".js-LastName").html(Decrypt(CodeEncrypter, User.LastName));
        $(".js-RoleName").html(Role.Name);
    }

    async function LoadTable() {
        const Passwords = await GetTable("Passwords");
        var TableMainString = "";
        Passwords.forEach(item => {
            TableMainString += "<tr>";
            TableMainString += "<td>" + item.Name + "</td>";
            TableMainString += "<td>" + GetString(item.Password) + "</td>";
            TableMainString += "<td>";
            TableMainString += `<button class="btn btn-sm btn-outline-info" type="button" onclick="CopyPassword('` + item.Password + `')">`;
            TableMainString += "<i class='fa-solid fa-clipboard'></i>";
            TableMainString += "</button>";
            TableMainString += "</td>";
            TableMainString += "</tr>";
        });
        tableMain.innerHTML = TableMainString;
    }

    function GetString(Text) {
        if(IsEncrypt) {
            return Text;
        } else {
            return Decrypt(CodeEncrypter, Text);
        }
    }
    //#endregion

});

//#region INTERACTUAR CON HTML

function CopyPassword (item) {
    const Password = Decrypt(CodeEncrypter, item);
    CopiarAlPortapapeles(Password);
    ShowMessage("Contraseña copiada correctamente", "info", "top-end");
}
//#endregion