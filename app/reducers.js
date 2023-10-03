import axios from "axios";

const breeds = {
    affenpinscher: [],
    african: [],
    airedale: [],
    akita: [],
    appenzeller: [],
    australian: [
        'shepherd'
    ],
    basenji: [],
    beagle: [],
    bluetick: [],
    borzoi: [],
    bouvier: [],
    boxer: [],
    brabancon: [],
    briard: [],
    buhund: [
        'norwegian'
    ],
    bulldog: [
        'boston',
        'english',
        'french'
    ],
    bullterrier: [
        'staffordshire'
    ],
    cattledog: [
        'australian'
    ],
    chihuahua: [],
    chow: [],
    clumber: [],
    cockapoo: [],
    collie: [
        'border'
    ],
    coonhound: [],
    corgi: [
        'cardigan'
    ],
    cotondetulear: [],
    dachshund: [],
    dalmatian: [],
    dane: [
        'great'
    ],
    deerhound: [
        'scottish'
    ],
    dhole: [],
    dingo: [],
    doberman: [],
    elkhound: [
        'norwegian'
    ],
    entlebucher: [],
    eskimo: [],
    finnish: [
        'lapphund'
    ],
    frise: [
        'bichon'
    ],
    germanshepherd: [],
    greyhound: [
        'italian'
    ],
    groenendael: [],
    havanese: [],
    hound: [
        'afghan',
        'basset',
        'blood',
        'english',
        'ibizan',
        'plott',
        'walker'
    ],
    husky: [],
    keeshond: [],
    kelpie: [],
    komondor: [],
    kuvasz: [],
    labradoodle: [],
    leonberg: [],
    lhasa: [],
    malamute: [],
    malinois: [],
    maltese: [],
    mastiff: [
        'bull',
        'english',
        'tibetan'
    ],
    mexicanhairless: [],
    mix: [],
    mountain: [
        'bernese',
        'swiss'
    ],
    newfoundland: [],
    otterhound: [],
    ovcharka: [
        'caucasian'
    ],
    papillon: [],
    pekinese: [],
    pembroke: [],
    pinscher: [
        'miniature'
    ],
    pitbull: [],
    pointer: [
        'german',
        'germanlonghair'
    ],
    pomeranian: [],
    poodle: [
        'medium',
        'miniature',
        'standard',
        'toy'
    ],
    pug: [],
    puggle: [],
    pyrenees: [],
    redbone: [],
    retriever: [
        'chesapeake',
        'curly',
        'flatcoated',
        'golden'
    ],
    ridgeback: [
        'rhodesian'
    ],
    rottweiler: [],
    saluki: [],
    samoyed: [],
    schipperke: [],
    schnauzer: [
        'giant',
        'miniature'
    ],
    segugio: [
        'italian'
    ],
    setter: [
        'english',
        'gordon',
        'irish'
    ],
    sharpei: [],
    sheepdog: [
        'english',
        'shetland'
    ],
    shiba: [],
    shihtzu: [],
    spaniel: [
        'blenheim',
        'brittany',
        'cocker',
        'irish',
        'japanese',
        'sussex',
        'welsh'
    ],
    spitz: [
        'japanese'
    ],
    springer: [
        'english'
    ],
    stbernard: [],
    terrier: [
        'american',
        'australian',
        'bedlington',
        'border',
        'cairn',
        'dandie',
        'fox',
        'irish',
        'kerryblue',
        'lakeland',
        'norfolk',
        'norwich',
        'patterdale',
        'russell',
        'scottish',
        'sealyham',
        'silky',
        'tibetan',
        'toy',
        'welsh',
        'westhighland',
        'wheaten',
        'yorkshire'
    ],
    tervuren: [],
    vizsla: [],
    waterdog: [
        'spanish'
    ],
    weimaraner: [],
    whippet: [],
    wolfhound: [
        'irish'
    ]
}

function needleInHaystack(needle, haystack) {
    for (let hIdx = 0; hIdx <= haystack.length - needle.length; hIdx++) {
      for (let nIdx = 0; nIdx < needle.length; nIdx++) {
        if (haystack[hIdx + nIdx] !== needle[nIdx]) break;
        if (nIdx + 1 === needle.length) return true;
      }
    }
    return false;
}

const punc = "()-.,;'_+=/* !@#$%^&`" + '"';

function sanitizeString(aString){
    let lowerString = aString.toLowerCase();
    let sanString = "";
    for(let i = 0; i < lowerString.length; i++){
        if(!punc.includes(lowerString.at(i))) sanString += lowerString.at(i);
    }
    return sanString;
}
  
  

//thunks
export function pictureAndFact(){
    const breedsArray = Object.keys(breeds);
    return async dispatch => {
        try {
            //get the dog fact
            const fact = (await axios.get("https://dog-api.kinduff.com/api/facts?number=1")).data.facts[0];

            let factBreed = "";
            let factSubBreed = "";
            let bIdx = -1;
            const sanitizedFact = sanitizeString(fact);

            //search the dog fact for mention of a breed
            for(let i = 0; i < breedsArray.length; i++){
                if(needleInHaystack(breedsArray[i],sanitizedFact)){
                    bIdx = i;
                    factBreed = breedsArray[i];
                    break;
                }
            }

            console.log(`Breed found: ${factBreed ? factBreed : "None"}`)

            //search again for mention of a sub breed
            if(bIdx >= 0 && breeds[breedsArray[bIdx]].length){
                for(let i = 0; i < breeds[breedsArray[bIdx]].length; i++){
                    if(needleInHaystack(breeds[breedsArray[bIdx]][i],sanitizedFact)){
                        factSubBreed = breeds[breedsArray[bIdx]][i];
                        break;
                    }
                }
            }

            console.log(`Sub breed found: ${factSubBreed ? factSubBreed : "None"}`);

            let pic = "";

            if(factSubBreed){
                pic = (await axios.get(`https://dog.ceo/api/breed/${factBreed}/${factSubBreed}/images/random`)).data.message;
            }else if(factBreed){
                pic = (await axios.get(`https://dog.ceo/api/breed/${factBreed}/images/random`)).data.message;
            }
            else{
                pic = (await axios.get("https://dog.ceo/api/breeds/image/random")).data.message;
            }

            dispatch({type:"DOG_AND_FACT", data: {
                fact: fact,
                pic: pic,
            }})
        } catch (error) {
            console.log(error);
        }
    }
}

//reducers

export default function (state = {}, action){
    switch(action.type){
        case("DOG_AND_FACT"):
        return {...state, ...action.data};
        default:
            return state;
    }
}