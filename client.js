function clicked(element, isliked, nbUpvotes){
     element.firstElementChild.className = (isliked)? "far fa-thumbs-up fa-lg" : "fas fa-thumbs-up fa-lg";
     element.lastElementChild.innerText= (isliked)? nbUpvotes-1 : nbUpvotes+1;
     //todo : add the feature to re-like an unliked challenge
}