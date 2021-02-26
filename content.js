class Definition {
  static defW = 250; //px
  static defH = 220; //px
  static defCount = 0;
  static activeDefinitions = new Map();

  constructor(wordSearched) {
    this.id = Definition.defCount++;
    console.log(this.id);

    /* Background is used to detect clicks out
     * of the definition box.
     * z-index is set to click the most recent
     * definition background first and close
     * them in order. */
    document.body.insertAdjacentHTML(
      "afterbegin",
      "<div id=dict-background><div>"
    );
    this.background = document.getElementById("dict-background");
    this.background.style.zIndex = Definition.defCount.toString();
    this.background.addEventListener("click", () => this.remove());

    this.definition = document.createElement("div");
    this.definition.classList.add("dict-definition");
    this.definition.style.zIndex = Definition.defCount.toString();

    this.closeButton = document.createElement("span");
    this.closeButton.classList.add("close-button");
    this.closeButton.insertAdjacentHTML("afterbegin", "&times");
    this.closeButton.addEventListener("click", () => this.remove());

    this.dictWord = document.createElement("h2");
    this.dictMeaning = document.createElement("p");

    this.definition.appendChild(this.closeButton);
    this.definition.appendChild(this.dictWord);
    this.definition.appendChild(this.dictMeaning);
  }

  async writeDefinitionContent(wordSearched) {
    try {
      let response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en_US/${wordSearched}`
      );
      let body = await response.json();
      body = body[0];
      let { word, meanings } = body;
      console.log(word);
      let meaning = meanings[0];
      let { partOfSpeech, definitions } = meaning;

      this.dictWord.appendChild(document.createTextNode(word));
      this.dictMeaning.appendChild(
        document.createTextNode(definitions[0].definition)
      );
      console.log(partOfSpeech);
      console.log(definitions[0].definition);
    } catch (error) {
      this.dictWord.appendChild(document.createTextNode(wordSearched));
      this.dictMeaning.appendChild(
        document.createTextNode("No definitions found.")
      );
    }
  }

  setPosition(textPosition) {
    const { top, right, bottom, left } = textPosition;
    console.log("bottom: ", bottom);
    console.log("top: ", top);
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    // console.log("Sizes: ", vw, vh);

    this.definition.style.left =
      (right + Definition.defW < vw ? right : left - Definition.defW) + "px";

    if (bottom + Definition.defH < vh)
      this.definition.style.top = bottom + "px";
    else this.definition.style.bottom = vh - top + "px";
  }

  add() {
    console.log("adding");
    Definition.activeDefinitions.set(this.id, this.definition);
    document.body.appendChild(this.definition);
  }

  remove() {
    console.log("removing");
    Definition.activeDefinitions.delete(this.id);
    this.definition.remove();
    this.background.remove();
  }
}

document.addEventListener("dblclick", async function myfunction() {
  const text = window.getSelection();
  const textString = text.toString();
  if (textString) {
    const textPosition = text.getRangeAt(0).getBoundingClientRect();
    console.log(textPosition);
    const definition = new Definition(textString);
    await definition.writeDefinitionContent(textString);
    definition.setPosition(textPosition);
    definition.add();
  }
});

const closeModals = (event) => {
  console.log("Hi");
  if (event.target === background) {
    console.log("background!!");
  }
};

// document.addEventListener("click", closeModals);
