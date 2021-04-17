
function clicked(element, isliked, nbUpvotes) {
  if(isliked){
    let newValue = "clicked(this, false,"+ (nbUpvotes - 1) + ")";
    element.setAttribute("onclick", newValue);
    element.firstElementChild.className = "far fa-thumbs-up fa-lg";
    element.lastElementChild.innerText = nbUpvotes - 1;
  }else{
    let newValue = "clicked(this, true,"+ (nbUpvotes + 1) + ")"
    element.setAttribute("onclick" ,newValue);
    element.firstElementChild.className = "fas fa-thumbs-up fa-lg";
    element.lastElementChild.innerText = nbUpvotes + 1;
  }
}

function readfile() {
var data = {};
data.username = '/home/test/pgadmin.txt';
data.challengeid = '.txt';
console.log(data);
  $.ajax({
    url: '/read_file',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function(data) {
      console.log(data);
    }
  });
}
