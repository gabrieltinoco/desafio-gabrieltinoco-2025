const ANIMAIS_DB = {
  rexcão: { nome: "Rex", tipo: "cão", brinquedos: ["RATO", "BOLA"] },
  mimigato: { nome: "Mimi", tipo: "gato", brinquedos: ["BOLA", "LASER"] },
  fofogato: {
    nome: "Fofo",
    tipo: "gato",
    brinquedos: ["BOLA", "RATO", "LASER"],
  },
  zerogato: { nome: "Zero", tipo: "gato", brinquedos: ["RATO", "BOLA"] },
  bolacão: { nome: "Bola", tipo: "cão", brinquedos: ["CAIXA", "NOVELO"] },
  bebecão: { nome: "Bebe", tipo: "cão", brinquedos: ["LASER", "RATO", "BOLA"] },
  locojabuti: { nome: "Loco", tipo: "jabuti", brinquedos: ["SKATE", "RATO"] },
};

const BRINQUEDOS_VALIDOS = new Set([
  "RATO",
  "BOLA",
  "LASER",
  "CAIXA",
  "NOVELO",
  "SKATE",
]);

class AbrigoAnimais {
  _validarEntradas(brinquedosPessoa1, brinquedosPessoa2, animaisParaAdocao) {
    if (new Set(brinquedosPessoa1).size !== brinquedosPessoa1.length) {
      return "Brinquedo inválido";
    }

    if (new Set(brinquedosPessoa2).size !== brinquedosPessoa2.length) {
      return "Brinquedo inválido";
    }

    const todosOsBrinquedos = [...brinquedosPessoa1, ...brinquedosPessoa2];
    for (const brinquedo of todosOsBrinquedos) {
      if (!BRINQUEDOS_VALIDOS.has(brinquedo)) {
        return "Brinquedo inválido";
      }
    }

    if (new Set(animaisParaAdocao).size !== animaisParaAdocao.length) {
      return "Animal inválido";
    }

const nomesValidos = Object.values(ANIMAIS_DB).map(animal => animal.nome.toLowerCase());
for (const animalNome of animaisParaAdocao) {
  
  if (!nomesValidos.includes(animalNome.toLowerCase())) {
    return 'Animal inválido';
  }
}

    return null;
  }

  _verificaOrdemBrinquedos(brinquedosPessoa, brinquedosAnimal) {
    let i = 0;
    let j = 0;

    while (i < brinquedosAnimal.length && j < brinquedosPessoa.length) {
      if (brinquedosAnimal[i] === brinquedosPessoa[j]) {
        i++;
      }
      j++;
    }

    return i === brinquedosAnimal.length;
  }

  _podeAdotar(brinquedosPessoa, animal, pessoaJaAdotou) {
    // Regra especial para o Locojabuti
    if (animal.tipo === "jabuti") {
      if (!pessoaJaAdotou) return false; // Precisa de companhia
      const brinquedosPessoaSet = new Set(brinquedosPessoa);
      return animal.brinquedos.every((b) => brinquedosPessoaSet.has(b));
    }

    // Regra de verificar a subsequência.
    return this._verificaOrdemBrinquedos(brinquedosPessoa, animal.brinquedos);
  }

  encontraPessoas(brinquedosPessoa1Str, brinquedosPessoa2Str, animaisStr) {
    const brinquedosPessoa1 = brinquedosPessoa1Str
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
    const brinquedosPessoa2 = brinquedosPessoa2Str
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
    const animaisParaAdocao = animaisStr
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    const erro = this._validarEntradas(
      brinquedosPessoa1,
      brinquedosPessoa2,
      animaisParaAdocao
    );

    if (erro) {
      return { erro: erro };
    }

    const adocoes = {};
    let contagemAdocoesPessoa1 = 0;
    let contagemAdocoesPessoa2 = 0;

    for (const nomeAnimalInput of animaisParaAdocao) {
      // CORREÇÃO 2: Encontrar o animal pelo NOME
      const animal = Object.values(ANIMAIS_DB)
        .find(a => a.nome.toLowerCase() === nomeAnimalInput.toLowerCase());

      const p1PodeAdotar =
        contagemAdocoesPessoa1 < 3 &&
        this._podeAdotar(
          brinquedosPessoa1,
          animal,
          contagemAdocoesPessoa1 > 0
        );
      const p2PodeAdotar =
        contagemAdocoesPessoa2 < 3 &&
        this._podeAdotar(
          brinquedosPessoa2,
          animal,
          contagemAdocoesPessoa2 > 0
        );

      if (p1PodeAdotar && p2PodeAdotar) {
        adocoes[animal.nome] = "abrigo";
      } else if (p1PodeAdotar) {
        adocoes[animal.nome] = "pessoa 1";
        contagemAdocoesPessoa1++;
      } else if (p2PodeAdotar) {
        adocoes[animal.nome] = "pessoa 2";
        contagemAdocoesPessoa2++;
      } else {
        adocoes[animal.nome] = "abrigo";
      }
    }

    const listaFinal = Object.keys(adocoes)
      .sort()
      .map((nomeAnimal) => `${nomeAnimal} - ${adocoes[nomeAnimal]}`);

    return { lista: listaFinal };
  }
}

export { AbrigoAnimais as AbrigoAnimais };
