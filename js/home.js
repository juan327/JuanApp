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
    let formPassword = document.getElementById("form-password");
    let txtFilterString = document.getElementById("txt-filterString");
    
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
            this.innerHTML = "<i class='fa-solid fa-eye'></i> Contraseñas visibles";
            ShowMessage("Las contraseñas ahora son visibles", "info", "bottom");
        } else {
            IsEncrypt = true;
            this.classList.remove("btn-success");
            this.classList.add("btn-secondary");
            this.innerHTML = "<i class='fa-solid fa-eye-slash'></i> Contraseñas ocultas";
            ShowMessage("Las contraseñas ahora estan ocultas", "info", "bottom");
        }
        LoadTable();
    });
    txtFilterString.addEventListener("keyup", function(event) {
        LoadTable();
    });
    
    formPassword.addEventListener("submit", async function(event){
        event.preventDefault();
        if(!await IsLogin()) {
            return;
        }

        const Data = SerializeForm(this);
        const Passwords = await GetTable("Passwords");

        const Name = Encrypt(CodeEncrypter, Data.Name.toUpperCase());
        const Password = Encrypt(CodeEncrypter, Data.Password);

        const newObj = {
            PasswordId: GenerateGuid(),
            Name: Name,
            Password: Password,
            Created: GetDateTimeUtcNow(),
        };
        Passwords.push(newObj);
        
        const response = UpdateTable("Passwords", Passwords);
        console.log(response);
        ShowModalMessage("Registrado correctamente", "success");
    });

    async function LoadData() {
        $(".js-UserName").html(Decrypt(CodeEncrypter, User.UserName));
        $(".js-Name").html(Decrypt(CodeEncrypter, User.Name));
        $(".js-LastName").html(Decrypt(CodeEncrypter, User.LastName));
        $(".js-RoleName").html(Role.Name);
    }

    async function LoadTable() {
        const FilterString = document.getElementById("txt-filterString").value;

        const Passwords = await GetTable("Passwords");
        var query = Passwords.reverse(c=>c.Created);
        if(FilterString != undefined && FilterString != "" && FilterString != null && FilterString != "null") {
            query = query.filter(c=>Decrypt(CodeEncrypter, c.Name).includes(FilterString.toUpperCase())
                                || GetString(c.Password).includes(FilterString));
        }

        var TableMainString = "";
        query.forEach(item => {
            const Created = AddMinutes(ParseDateTime(item.Created), TimeUtcHours);
            TableMainString += "<tr>";
            TableMainString += "<td>" + Decrypt(CodeEncrypter, item.Name) + "</td>";
            TableMainString += "<td>" + GetString(item.Password) + "</td>";
            TableMainString += "<td>" + DateTimeToString(Created, "dd/MM/yyyy HH:mm") + "</td>";
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