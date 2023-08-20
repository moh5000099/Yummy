/******************************************************** Loading and Begining ********************************************************/
$(document).ready(()=>{
    $("#loading").delay(500).fadeOut(500, function(){
        $("#meals").css("display","block");
        currentFlag="#meals";
        $("#bar").css("display","block");
        $("section").not("#meals").not("#bar").not("#loading").css("display","none");
        $("body").css("overflow","auto");
        $("#bar").css("z-index","200")
    });
})
let currentFlag="#meals";

function startLoading(){
    $("#loading").fadeIn(100,()=>{
        $(window).scrollTop("0px")
    })
    $("body").css("overflow","hidden");
    
    if(currentFlag != "#searchMeals"){
    $("section").not("#bar").not("#loading").css("display","none");
    }
}
function finishtLoading(nowWindow="#meals"){
    $("section").not(nowWindow).not("#bar").not("#loading").css("display","none");
    $(nowWindow).css("display","block");
    $("#loading").fadeOut(500);
        $("#bar").css("display","block");
        $("body").css("overflow","auto");


}

getMealsByName("");

/******************************************************** SideBar ********************************************************/
$("#closeBar,#openBar").click(function(){
    let barwidth = $(".barContent").outerWidth(true)-$(".barControl").outerWidth(true);
    if($("#bar").css("left") == "0px"){
        $("#bar").animate({"left":`-${barwidth}`});
        $("#closeBar").css("display","none");
        $("#openBar").css("display","block");
        $("#bar li").animate({paddingTop:"300px",opacity:"0"},1000)
    }
    else{
        $("#bar").animate({"left":"0px"});
        $("#openBar").css("display","none");
        $("#closeBar").css("display","block");
        $("#bar li").animate({paddingTop:"1.5rem",opacity:"1"},1000)
    }
})


//////////////////////////////// Buttons /////////////////////////////////
$("#barSearch").click(function(){
    closingBar();
    startLoading();
    currentFlag="#searchMeals"
    finishtLoading(currentFlag);
});

$("#barCate").click(function(){
    currentFlag="#meals"
    closingBar();

    getListByCate();//finish loading within the display
});
$("#barArea").click(function(){
    currentFlag="#meals"
    closingBar();

    getListByAI('a');//finish loading within the display
});
$("#barIngred").click(function(){
    currentFlag="#meals"
    closingBar();

    getListByAI('i');//finish loading within the display
});
$("#barContact").click(function(){
    closingBar();
    startLoading();
    currentFlag="#contactUs"
    finishtLoading(currentFlag);
});


function closingBar(){
    let barwidth = $(".barContent").outerWidth(true)-$(".barControl").outerWidth(true);
    if($("#bar").css("left") == "0px"){
        $("#bar").animate({"left":`-${barwidth}`});
        $("#closeBar").css("display","none");
        $("#openBar").css("display","block");
        $("#bar li").animate({paddingTop:"300px",opacity:"0"},1000)
    }
}


/******************************************************** Get Menu ********************************************************/
async function getMealDetailsById(myMealId){
    startLoading();
    let myMealsApi = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${myMealId}`);
    let myMealArr = await myMealsApi.json();
    let myMeal = myMealArr.meals[0];
    displayMealDetails(myMeal);
    finishtLoading("#mealDetails");
}
async function getMealsByName(name){
    startLoading();
    let myMealsApi = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    let myMeal = await myMealsApi.json();
    let myMealArr = myMeal.meals;
    displayMeals(myMealArr);
}

async function getMealsByFLetter(letter){
    startLoading();
    let myMealsApi = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    let myMeal = await myMealsApi.json();
    let myMealArr = myMeal.meals;
    displayMeals(myMealArr);
}
async function getListByCate(){
    startLoading();
    let myMealsApi = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let myMeal = await myMealsApi.json();
    let myMealArr = myMeal.categories;
    displayList(myMealArr);
}
async function getMealMealsByCAI(type,name){
    startLoading();
    let myMealsApi = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?${type}=${name}`);
    let myMeal = await myMealsApi.json();
    let myMealArr = myMeal.meals;
    displayMeals(myMealArr);
}

async function getListByAI(name){
    startLoading();
    let myMealsApi = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?${name}=list`);
    let myMeal = await myMealsApi.json();
    let myMealArr = myMeal.meals;
    if(name == 'a')
    displayListArea(myMealArr);
    else if(name == 'i'){
        myMealArr=myMealArr.slice(0, 20);
        displayListIngred(myMealArr);
    }
}


/******************************************************** Display Details ********************************************************/

function displayMeals(myMealsArr){
    let box=``;

    for(let i=0; i<myMealsArr.length; i++){
        box+=`
        <div class="col-md-3 p-3">
            <div class="item rounded-3 overflow-hidden position-relative" onclick="getMealDetailsById(${myMealsArr[i].idMeal})">
                <div class="itemOverlay position-absolute d-flex align-items-center overflow-hidden text-center"><p class="fs-2 my-0 ms-2">${myMealsArr[i].strMeal}</p></div>
                <img src="${myMealsArr[i].strMealThumb}" alt="" class="img-fluid w-100">
            </div>
        </div>`
    }

    $(`${currentFlag} .row`).html(box);
    finishtLoading(currentFlag);
    
}
function displayList(myMealsArr){
    let box=``;
    for(let i=0; i<myMealsArr.length; i++){
        box+=`
        <div class="col-md-3 p-3">
            <div class="item rounded-3 overflow-hidden position-relative" onclick="getMealMealsByCAI('c','${myMealsArr[i].strCategory}')">
                <div class="itemOverlay position-absolute overflow-hidden text-center">
                    <p class="fs-2 my-0 ms-2">${myMealsArr[i].strCategory}</p>
                    <p class="fs-6 my-0 ms-2">${myMealsArr[i].strCategoryDescription}</p>
                </div>
                <img src="${myMealsArr[i].strCategoryThumb}" alt="" class="img-fluid w-100">
            </div>
        </div>`
    }

    $(`${currentFlag} .row`).html(box);
    finishtLoading(currentFlag);
    
}
function displayListArea(myMealsArr){
    let box=``;
    for(let i=0; i<myMealsArr.length; i++){
        box+=`
        <div class="col-md-3 p-3">
            <div class="item rounded-3 overflow-hidden text-center border border-dark border-3 opacity-75 py-3" onclick="getMealMealsByCAI('a','${myMealsArr[i].strArea}')">
                <i class="fa-solid fa-city fa-3x text-danger"></i>
                <p class="fs-2 my-0 ms-2 text-white">${myMealsArr[i].strArea}</p>
            </div>
        </div>`
    }

    $(`${currentFlag} .row`).html(box);
    finishtLoading(currentFlag);
    
}
function displayListIngred(myMealsArr){
    let box=``;
    for(let i=0; i<myMealsArr.length; i++){
        box+=`
        <div class="col-md-3 p-3">
            <div class="item rounded-3 overflow-hidden text-center h-100 border border-dark border-3 opacity-75 py-3" onclick="getMealMealsByCAI('i','${myMealsArr[i].strIngredient}')">
                <i class="fa-solid fa-bowl-food fa-3x text-success"></i>
                <p class="fs-2 my-0 ms-2 text-white">${myMealsArr[i].strIngredient}</p>
                <p class="fs-6 my-0 ms-2 text-white">${(myMealsArr[i].strDescription.split(" ").slice(0,20)).join(" ")}</p>
            </div>
        </div>`
    }

    $(`${currentFlag} .row`).html(box);
    finishtLoading(currentFlag);
    
}

function displayMealDetails(myMeal){
    
    $("#itemDetailsImg").attr("src",myMeal.strMealThumb);
    $("#itemDetailsText").html(myMeal.strMeal);
    
    $("#instructions").html(myMeal.strInstructions);
    $("#area").html(myMeal.strArea);
    $("#category").html(myMeal.strCategory);
    
    for(let i=1; i<=20;i++){
        if(myMeal[`strIngredient${i}`] !="" && myMeal[`strIngredient${i}`] !=null && myMeal[`strMeasure${i}`] !="" && myMeal[`strMeasure${i}`] !=null ){
        $("#recipes").append(`<li class="p-1 m-2 rounded-3">${myMeal[`strMeasure${i}`]} ${myMeal[`strIngredient${i}`]}</li>`);
        }
    }

    let tags = myMeal.strTags
    if(tags !=null && tags != ""){
        let tagsArr=tags.split(",")
        for(let i=0; i<tagsArr.length;i++){
            $("#tags").append(`<li class="p-1 m-2 rounded-3">${tagsArr[i]}</li>`);
        }
    }

    if(myMeal.strSource !=null && myMeal.strSource !=""){
        $("#source").attr("href",myMeal.strSource)
    }
    else{
        $("#source").attr("href","#");
    }

    if(myMeal.strYoutube !=null && myMeal.strYoutube !=""){
        $("#youtube").attr("href",myMeal.strYoutube)
    }
    else{
        $("#youtube").attr("href","#");
    }
}
/******************************************************** Search Details ********************************************************/
$("#searchByName").keyup(function(){
    getMealsByName(this.value);
});
$("#searchByFLetter").keyup(function(){
    if(this.value.length == 1){
        getMealsByFLetter
        (this.value);
    }
    else if(this.value.length > 1){
        this.value = this.value[0]
        getMealsByFLetter(this.value);
    }

});
/******************************************************** Contact Us ********************************************************/
let flags=[false,false,false,false,false,false]
$("#cName").keyup(function(){
    let myRegex= /^[a-z A-Z]+$/gm;
    if(this.value != ""){
        if(myRegex.test(this.value)){
            $(this).removeClass("is-invalid");
            $(this).addClass("is-valid");
            $(this).next().css("display","none");
            flags[0]=true;
        }
        else{
            flags[0]=false;
            $(this).removeClass("is-valid");
            $(this).addClass("is-invalid");
            $(this).next().css("display","block");
        }
    }
    else{
        flags[0]=false;
        $(this).removeClass("is-valid");
        $(this).removeClass("is-invalid");
        $(this).next().css("display","none");
    }
    buttonChecking();
});
$("#cEmail").keyup(function(){
    let myRegex= /^[a-z_\.\-A-Z0-9]+(@)[a-z_\-A-Z]+\.[a-z_\-A-Z]{2,}$/gm;
    if(this.value != ""){
        if(myRegex.test(this.value)){
            $(this).removeClass("is-invalid");
            $(this).addClass("is-valid");
            $(this).next().css("display","none");
            flags[1]=true;
        }
        else{
            flags[1]=false;
            $(this).removeClass("is-valid");
            $(this).addClass("is-invalid");
            $(this).next().css("display","block");
        }
    }
    else{
        flags[1]=false;
        $(this).removeClass("is-valid");
        $(this).removeClass("is-invalid");
        $(this).next().css("display","none");
    }
    buttonChecking();
});
$("#cPhone").keyup(function(){
    let myRegex= /^\+?[0-9]{10,12}$/gm;
    if(this.value != ""){
        if(myRegex.test(this.value)){
            $(this).removeClass("is-invalid");
            $(this).addClass("is-valid");
            $(this).next().css("display","none");
            flags[2]=true;
        }
        else{
            flags[2]=false;
            $(this).removeClass("is-valid");
            $(this).addClass("is-invalid");
            $(this).next().css("display","block");
        }
    }
    else{
        flags[2]=false;
        $(this).removeClass("is-valid");
        $(this).removeClass("is-invalid");
        $(this).next().css("display","none");
    }
    buttonChecking();
});
$("#cAge").keyup(function(){
    let myRegex= /^[1-9]{1}[0-9]?$|^100$/gm;
    if(this.value != ""){
        if(myRegex.test(this.value)){
            $(this).removeClass("is-invalid");
            $(this).addClass("is-valid");
            $(this).next().css("display","none");
            flags[3]=true;
        }
        else{
            flags[3]=false;
            $(this).removeClass("is-valid");
            $(this).addClass("is-invalid");
            $(this).next().css("display","block");
        }
    }
    else{
        flags[3]=false;
        $(this).removeClass("is-valid");
        $(this).removeClass("is-invalid");
        $(this).next().css("display","none");
    }
    buttonChecking();
});
$("#cPass").keyup(function(){
    let myRegex= /(?=.*[0-9]{1}[a-zA-Z]{1}|.*[a-zA-Z]{1}[0-9]{1})(?=.*[0-9a-zA-Z]{8,})/gm;
    if(this.value != ""){
        if(myRegex.test(this.value)){
            $(this).removeClass("is-invalid");
            $(this).addClass("is-valid");
            $(this).next().css("display","none");
            flags[4]=true;
        }
        else{
            flags[4]=false;
            $(this).removeClass("is-valid");
            $(this).addClass("is-invalid");
            $(this).next().css("display","block");
        }
    }
    else{
        flags[4]=false;
        $(this).removeClass("is-valid");
        $(this).removeClass("is-invalid");
        $(this).next().css("display","none");
    }
    if($("#cRePass").val() == ""){
        buttonChecking();
    }
    else{
        cRePassFunc();
    }
});

$("#cRePass").keyup(cRePassFunc);

function cRePassFunc(){
    let rePass= $("#cPass").val();
    if(this.value != ""){
        if(rePass == $("#cRePass").val()){
            $("#cRePass").removeClass("is-invalid");
            $("#cRePass").addClass("is-valid");
            $("#cRePass").next().css("display","none");
            flags[5]=true;
        }
        else{
            flags[5]=false;
            $("#cRePass").removeClass("is-valid");
            $("#cRePass").addClass("is-invalid");
            $("#cRePass").next().css("display","block");
        }
    }
    else{
        flags[5]=false;
        $("#cRePass").removeClass("is-valid");
        $("#cRePass").removeClass("is-invalid");
        $("#cRePass").next().css("display","none");
    }
    buttonChecking();
}

function buttonChecking(){
    let enableBtn=true;
    for(let i=0; i<6; i++){
        enableBtn &=flags[i];
    }
    if(enableBtn){
        $("#cSubmit").removeAttr("disabled")
    }
    else{
        $("#cSubmit").attr("disabled","")
    }
}

//name check /^[a-z A-Z]+$/gm
//email check ^[a-z_\.\-A-Z0-9]+(@)[a-z_\-A-Z]+\.[a-z_\-A-Z]{2,}$
//phone check ^\+?[0-9]{10,12}$
//age ^[1-9]{1}[0-9]?$|^100$
//pass (?=.*[0-9]{1}[a-zA-Z]{1}|.*[a-zA-Z]{1}[0-9]{1})(?=.*[0-9a-zA-Z]{8,}) // the .* means any char with any number then my experssion comes to check wherever my experssion was