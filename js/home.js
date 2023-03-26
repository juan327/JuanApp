const CodeEncrypter = localStorage.getItem("CodeEncrypter");

$( document ).ready(async function() {
    if(!await IsLogin()) {
        RedirectToUrl(HostName + "/index.html");
    }

    //#region JS
    //#region variables
    const User = await GetUser();
    const Role = await GetRole(User.RoleId);

    let btnLogout = document.getElementById("btnLogout");
    let btnChangePassword = document.getElementById("btnChangePassword");
    let btnCopyGeneratePassword = document.getElementById("btnCopyGeneratePassword");
    let btnCopyEncrypt = document.getElementById("btnCopyEncrypt");
    let btnCopyDecrypt = document.getElementById("btnCopyDecrypt");

    let tableMain;

    let formPassword = document.getElementById("form-password");
    let formGeneratePassword = document.getElementById("form-generate-password");
    let formEncrypt = document.getElementById("form-encrypt");
    let formDecrypt = document.getElementById("form-decrypt");
    
    var IsEncrypt = true;

    //#endregion

    //#region FUNCIONES AL INICIAR
    LoadTable();
    await LoadData();
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
        tableMain.ajax.reload();
    });

    btnCopyGeneratePassword.addEventListener("click", function(event){
        var Password = $("#js-GeneratePassword").val();
        if(Password != '' && Password != undefined && Password != null) {
            CopiarAlPortapapeles(Password);
            ShowMessage("Contraseña copiada correctamente", "info", "top-end");
        }
    });

    btnCopyEncrypt.addEventListener("click", function(event){
        var Password = $("#js-EncryptText").val();
        if(Password != '' && Password != undefined && Password != null) {
            CopiarAlPortapapeles(Password);
            ShowMessage("Encriptación copiada correctamente", "info", "top-end");
        }
    });

    btnCopyDecrypt.addEventListener("click", function(event){
        var Password = $("#js-DecryptText").val();
        if(Password != '' && Password != undefined && Password != null) {
            CopiarAlPortapapeles(Password);
            ShowMessage("Desencriptación copiada correctamente", "info", "top-end");
        }
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
        //$('#modal-Create').modal('hide');
        this.reset();
        tableMain.ajax.reload();
        ShowModalMessage("Registrado correctamente", "success");
    });
    
    formGeneratePassword.addEventListener("submit", async function(event){
        event.preventDefault();
        if(!await IsLogin()) {
            return;
        }

        const Data = SerializeForm(this);
        const UseUpperCase = Data.UseUpperCase == "on";
        const UseSpecialChars = Data.UseSpecialChars == "on";
        const passwordGenerate = generatePassword(Data.Length, UseUpperCase, UseSpecialChars);

        $("#js-GeneratePassword").val(passwordGenerate);
    });
    
    formEncrypt.addEventListener("submit", async function(event){
        event.preventDefault();
        if(!await IsLogin()) {
            return;
        }

        const Data = SerializeForm(this);
        const textEncrypt = Encrypt(CodeEncrypter, Data.Input);

        $("#js-EncryptText").val(textEncrypt);
    });
    
    formDecrypt.addEventListener("submit", async function(event){
        event.preventDefault();
        if(!await IsLogin()) {
            return;
        }

        const Data = SerializeForm(this);
        const textDecrypt = Decrypt(CodeEncrypter, Data.Input);

        $("#js-DecryptText").val(textDecrypt);
    });

    async function LoadData() {
        $(".js-UserName").html(Decrypt(CodeEncrypter, User.UserName));
        $(".js-Name").html(Decrypt(CodeEncrypter, User.Name));
        $(".js-LastName").html(Decrypt(CodeEncrypter, User.LastName));
        $(".js-RoleName").html(Role.Name);
    }

    function LoadTable() {
        const options = {
            columns: [
                {
                    data: "Name",
                    render: function(data){
                        return Decrypt(CodeEncrypter, data);
                    }
                },
                {
                    data: "Password",
                    render: function(data){
                        return GetString(data);
                    }
                },
                {
                    data: "Created",
                    render: function(data) {
                        const Created = AddMinutes(ParseDateTime(data), TimeUtcHours);
                        return formatDate(Created, "dd/MM/yyyy HH:mm");
                    }
                },
                {
                    data: "Password",
                    render: function(data){
                        var TableMainString = `<button class="btn btn-sm btn-outline-info" type="button" onclick="CopyPassword('` + data + `')">`;
                        TableMainString += "<i class='fa-solid fa-clipboard'></i>";
                        TableMainString += "</button>";
                        return TableMainString;
                    }
                }
            ],
            order: [[2, 'desc']],
        };
        tableMain = BuidTable("Passwords", options);
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