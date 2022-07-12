let link = "";
const label = document.querySelector("label");
const onEnter = () => {
  label.classList.add("active");
};
const onLeave = () => {
  label.classList.remove("active");
};
label.addEventListener("dragenter", onEnter);
label.addEventListener("drop", onLeave);
label.addEventListener("dragend", onLeave);
label.addEventListener("dragexit", onLeave);
label.addEventListener("dragleave", onLeave);

const upload_file = (name, base64, uid) => {
  let data = { name, base64, uid };
  fetch("/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((resp) => resp.json())
    .then((data) => handle_upload(data));
};

const create_link = async (data) => {
  const link_div = document.querySelector("#link");
  const promt_div = document.querySelector("#promt");
  let url = document.createElement("a");
  let clipboard_btn = document.createElement("input");
  clipboard_btn.type = "button";
  clipboard_btn.value = "Copy";
  clipboard_btn.style["margin-top"] = "5px";
  clipboard_btn.classList.add("progress");
  url.href = data;
  url.append(data);
  link_div.style.width = "fit-content";
  link_div.style.border = "2px solid";
  link_div.style.padding = "5px";
  link_div.style["margin-top"] = "5px";
  link_div.style["border-radius"] = "5px";
  link_div.append(url);
  link_div.append(document.createElement("br"));
  link_div.append(clipboard_btn);
  clipboard_btn.addEventListener("click", () => {
    navigator.clipboard.writeText(data);
    clipboard_btn.value = "Copied";
    clipboard_btn.style.background = "red";
  });
};

const handle_upload = async (data) => {
  if (data.status === "uploaded") {
    link = window.location.origin;
    for (e of data.link) {
      if (e == " ") {
        link += "%20";
      } else {
        link += e;
      }
    }
    _btn_upload.classList.add("uploaded");
    _btn_upload.value = "Uploaded";
    await create_link(link);
  }
};
const readFile = (file) => {
  const uid = document.querySelector("#user-id");
  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    const result = event.target.result;
    upload_file(file.name, result, uid.value);
  });

  reader.addEventListener("progress", (event) => {
    if (event.loaded && event.total) {
      const percent = (event.loaded / event.total) * 100;
      const progress = document.querySelector("#file_progress");
      progress.innerHTML = `Progress: ${Math.round(percent)}`;
    }
  });
  reader.readAsDataURL(file);
};

const _file_change = () => {
  const _file = document.querySelector("#inp-file");
  const fileList = _file.files;
  console.log(fileList[0]);
  readFile(fileList[0]);
};

const _btn_upload = document.querySelector("#file-upload");
_btn_upload.addEventListener("click", () => _file_change());
