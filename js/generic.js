const IsLocal = false;
const HostName = IsLocal ? "http://192.168.1.3:5500" : "https://juan327.github.io/JuanApp";
const TimeUtcHours = -300;

async function GetUser() {
    const Users = await GetTable("Users");
    if (Users == undefined) {
        return;
    }
    const UserId = localStorage.getItem("UserId");
    if (UserId != undefined) {
        return Users.find(c => c.UserId == UserId);
    } else {
        return undefined;
    }
}

async function GetRole(RoleId) {
    const Roles = await GetTable("Roles");
    if (Roles == undefined) {
        return;
    }

    if (RoleId != undefined) {
        return Roles.find(c => c.RoleId == RoleId);
    } else {
        return undefined;
    }
}

async function IsLogin() {
    const User = await GetUser();
    const result = User != undefined;
    return result;
}

function SerializeForm(form) {
    // Get all field data from the form
    let data = new FormData(form);

    // Convert to an object
    return SerializeFormData(data);
}

function SerializeFormData(formData) {
    let obj = {};
    for (let [key, value] of formData) {

        if (obj[key] !== undefined) {
            if (!Array.isArray(obj[key])) {
                obj[key] = [obj[key]];
            }
            obj[key].push(value);
        } else {
            obj[key] = value;
        }
    }
    return obj;
}

function GetTable(tableName) {
    const filePath = HostName + "/db/" + tableName + ".json";

    return fetch(filePath).then((response) => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Something went wrong');
    })
        .then((responseJson) => {
            return responseJson;
        })
        .catch((error) => {
            console.log(error);
        });
}


function BuidTable(tableName, options) {
    const filePath = HostName + "/db/" + tableName + ".json";
    return $('#table-main').DataTable({
        ajax: {
            url: filePath,
            dataSrc: ''
        },
        responsive: true,
        language: {
            "decimal": "",
            "emptyTable": "No hay información",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
            "infoFiltered": "(Filtrado de _MAX_ total entradas)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ registros",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "zeroRecords": "Sin resultados encontrados",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        },
        columns: options.columns,
        order: options.order,
    });

}

function CopiarAlPortapapeles(text) {
    var aux = document.createElement("input");
    aux.setAttribute("value", text);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
}

function RedirectToUrl(url) {
    var link = document.createElement('a');
    link.href = url;
    link.click();
}

function DownloadByteArray(name, byte) {
    var link = document.createElement('a');
    link.href = 'data:application/octet-stream;base64,' + byte;
    link.download = name;
    link.target = '_blank';
    link.click();
}

function ShowModalMessage(text, icon) {
    Swal.fire({
        icon: icon,
        title: text,
    })
}

function ShowMessage(text, icon, position) {

    const Toast = Swal.mixin({
        toast: true,
        position: position,
        showConfirmButton: false,
        timer: 3000,
    })

    Toast.fire({
        icon: icon,
        title: text,
    })
}

function GenerateGuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function GetDateTimeUtcNow() {
    const DateTime = new Date();
    const Year = DateTime.getUTCFullYear().toString().padStart(4, 0);
    const Month = (DateTime.getUTCMonth() + 1).toString().padStart(2, 0);
    const Day = DateTime.getUTCDate().toString().padStart(2, 0);
    const Hour = DateTime.getUTCHours().toString().padStart(2, 0);
    const Minute = DateTime.getUTCMinutes().toString().padStart(2, 0);
    const Second = DateTime.getUTCSeconds().toString().padStart(2, 0);

    return Year + "," + Month + "," + Day + "," + Hour + "," + Minute + "," + Second;
}

function GetDateTimeString(DateTime) {
    const Year = DateTime.getUTCFullYear().toString().padStart(4, 0);
    const Month = (DateTime.getUTCMonth() + 1).toString().padStart(2, 0);
    const Day = DateTime.getUTCDate().toString().padStart(2, 0);
    const Hour = DateTime.getUTCHours().toString().padStart(2, 0);
    const Minute = DateTime.getUTCMinutes().toString().padStart(2, 0);
    const Second = DateTime.getUTCSeconds().toString().padStart(2, 0);

    return Year + "," + Month + "," + Day + "," + Hour + "," + Minute + "," + Second;
}

function AddHours(dateTime, hours) {
    dateTime.setHours(dateTime.getHours() + hours);
    return dateTime;
}

function AddMinutes(dateTime, minutes) {
    return new Date(dateTime.getTime() + minutes * 60000);
}

function UpdateTable(tableName, jsonList) {
    //const filePath = HostName + "/db/" + tableName + ".json";
    const content = JSON.stringify(jsonList);
    const fileName = tableName + ".json";
    const a = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}

function ParseDateTime(dateTimeString) {
    const ListTemp = dateTimeString.split(",");
    switch (ListTemp.length) {
        case 3:
            return new Date(ListTemp[0] + "-" + ListTemp[1] + "-" + ListTemp[2]);
        case 4:
            return new Date(ListTemp[0] + "-" + ListTemp[1] + "-" + ListTemp[2] + "T" + ListTemp[3] + ":00:00");
        case 5:
            return new Date(ListTemp[0] + "-" + ListTemp[1] + "-" + ListTemp[2] + "T" + ListTemp[3] + ":" + ListTemp[4] + ":00");
        case 6:
            return new Date(ListTemp[0] + "-" + ListTemp[1] + "-" + ListTemp[2] + "T" + ListTemp[3] + ":" + ListTemp[4] + ":" + ListTemp[5]);
        default:
            return new Date(ListTemp[0] + "-" + ListTemp[1] + "-" + ListTemp[2]);
    }
}

function formatDate(date, format) {
    // Crear un objeto de fecha a partir de la cadena de fecha dada
    const dateObj = new Date(date);

    // Obtener los componentes de fecha individuales de la fecha del objeto de fecha
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // Agregar 1 porque getMonth devuelve un índice de base cero para el mes
    const day = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();

    // Crear un objeto de formato que mapea los caracteres del formato a los componentes de fecha correspondientes
    const formatObj = {
        'yyyy': year,
        'MM': month.toString().padStart(2, '0'), // Agregar un cero inicial si el mes tiene un solo dígito
        'dd': day.toString().padStart(2, '0'), // Agregar un cero inicial si el día tiene un solo dígito
        'HH': hours.toString().padStart(2, '0'), // Agregar un cero inicial si la hora tiene un solo dígito
        'mm': minutes.toString().padStart(2, '0'), // Agregar un cero inicial si los minutos tienen un solo dígito
        'ss': seconds.toString().padStart(2, '0') // Agregar un cero inicial si los segundos tienen un solo dígito
    };

    // Reemplazar cada carácter en el formato con el componente de fecha correspondiente
    for (const char in formatObj) {
        format = format.replace(char, formatObj[char]);
    }

    // Devolver la cadena de fecha formateada
    return format;
}

function generatePassword(length, useUpperCase, useSpecialChars) {
    // Definir los caracteres que se pueden usar en la contraseña
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numericChars = '0123456789';
    const specialChars = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';

    // Crear una lista con los caracteres que se usarán en la contraseña
    let chars = lowercaseChars + numericChars;
    if (useUpperCase) chars += uppercaseChars;
    if (useSpecialChars) chars += specialChars;

    // Generar la contraseña aleatoria
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
}

