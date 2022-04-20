const getAPIData = async (url) => {
  try {
    const result = await fetch(url)
    return await result.json()
  } catch (error) {
    console.error(error)
  }
}

// only simplified pokemon inside of the array
const loadedPokemon = []

async function loadPokemon(offset = 0, limit = 25) {
  const pokeData = await getAPIData(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  )
  for (const nameAndURL of pokeData.results) {
    const pokemon = await getAPIData(nameAndURL.url)

    const simplifiedPokemon = {
      id: pokemon.id,
      height: pokemon.height,
      weight: pokemon.weight,
      name: pokemon.name,
      types: pokemon.types,
      abilities: pokemon.abilities,
      moves: pokemon.moves.slice(0, 3)
    }
    loadedPokemon.push(simplifiedPokemon)
    populatePokeCard(simplifiedPokemon)
  }
}

class Pokemon {
  constructor(name, height, weight, abilities, types) {
      this.id = 9001
      this.name = name,
      this.height = height,
      this.weight = weight,
      this.abilities = abilities,
      this.types = types;
  }
}

const newButton = document.createElement("button")
newButton.textContent = "New Pokemon"
const header = document.querySelector("header")
header.appendChild(newButton)

newButton.addEventListener("click", () => {
  const pokeName = window.prompt('What is the name of your new Pokemon?', 'Thoremon');
  const pokeHeighht = window.prompt("What is the Pokemon's height?", 20);
  const pokeWeight = window.prompt("What is the Pokemon's weight?", 1000);
  const pokeAbilities = window.prompt("What are your Pokemon's abilities? (Use a comma-separated list)", 'run, jump');
  const pokeTypes = window.prompt("What are your Pokemon's types? (Up to two types seperated by a space)" , 'ground water');


  const newPokemon = new Pokemon(
    "Thoremon",
    45,
    2398,
    makeAbilitiesArray('run-away, gluttony'),
    makeTypesArray("ground")
  )
  console.log(newPokemon);
  populatePokeCard(newPokemon)
})

function makeAbilitiesArray(spacedString) {
  return spacedString.split(',').map((abilityName) => {
    return {
      ability: {name: abilityName}
    }
  })
}

function makeTypesArray(commaString) {
  return commaString.split(' ').map((typeName) => {
    return {
      type: {name: typeName}
    }
  })
}

const pokeGrid = document.querySelector(".pokeGrid")

function populatePokeCard(pokemon) {
  const pokeScene = document.createElement("div")
  pokeScene.className = "scene"
  const pokeCard = document.createElement("div")
  pokeCard.className = "card"
  pokeCard.addEventListener("click", () =>
    pokeCard.classList.toggle("is-flipped")
  )

  pokeCard.appendChild(populateCardFront(pokemon))
  pokeCard.appendChild(populateCardBack(pokemon))
  pokeScene.appendChild(pokeCard)
  pokeGrid.appendChild(pokeScene)
}

function populateCardFront(pokemon) {
  const pokeFront = document.createElement("figure")
  pokeFront.className = "cardFace front"
  const pokeType1 = pokemon.types[0].type.name
  const pokeType2 = pokemon.types[1]?.type.name
  pokeFront.style.setProperty('background', getPokeTypeColor(pokeType1))
  if(pokeType2) {
    //fix gradient if there are two types for the pokemon
    pokeFront.style.setProperty('background', `linear-gradient(${getPokeTypeColor(pokeType1)}, {$getPokeTypeColot(pokeType2)})`)
  }
  
  const pokeImg = document.createElement("img")
  if (pokemon.id > 9000) {
    //load local image
    pokeImg.src = "../images/pokeball.png";
  } else {
    pokeImg.src = `https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
  }
  const pokeCaption = document.createElement("figCaption")
  pokeCaption.textContent = pokemon.name

  pokeFront.appendChild(pokeImg)
  pokeFront.appendChild(pokeCaption)
  return pokeFront
}

function populateCardBack(pokemon) {
  const pokeBack = document.createElement("div")
  pokeBack.className = "cardFace back"
  const label = document.createElement("h4")
  label.textContent = "Abilities"
  pokeBack.appendChild(label)
  const abilitiesList = document.createElement("ul")
  pokemon.abilities.forEach((abilityItem) => {
    const listItem = document.createElement("li")
    // console.log(`Pokemon ${pokemon.name}'s ability is: ${abilityItem.ability.name}`)
    listItem.textContent = abilityItem.ability.name
    abilitiesList.appendChild(listItem)
  })
  pokeBack.appendChild(abilitiesList)
  return pokeBack
}

function getPokeTypeColor(pokeType){
  let color 
  // if(pokeType === "grass") color = '#00FF00
  switch (pokeType){
    case 'grass':
      color = '#FF0000'
      break
    case 'fire':
      color = '#0000FF'
      break
    case 'water':
      color = '#00FF00'
      break
    case 'bug':
      color = '#7FFF00'
      break
    case 'normal':
      color = '#F5F5DC'
      break
    case 'flying':
      color = '#00FFFF'
      break
    case 'poison':
      color = '#C300FF'
      break
    case 'electric':
      color = '#C8FF00'
      break
    case 'psychic':
      color = '#pink'
      break
    case 'ground':
      color = '#brown'
      break
    default:
      color = '#888888'
  }
  return color
}

loadPokemon(0, 25)

/*
function getPokemonByType(type) {
  return loadedPokemon.filter((pokemon) => pokemon.types[0].type.name === type)
}

console.log(getPokemonByType(grass))
*/