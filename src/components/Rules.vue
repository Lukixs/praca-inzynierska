<template>
  <div class="instructions">
    <header>
      <h1>Wymogi</h1>
    </header>
    <div class="requirements">
      <ul>
        <li v-for="(item, itemIndex) in getRequirements()" :key="itemIndex">
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>
    <header>
      <h1>Zasady</h1>
    </header>
    <div class="rules">
      <div
        class="rules-pack"
        v-for="(pack, packIndex) in getRules()"
        :key="packIndex"
      >
        <ul>
          <li v-for="(item, itemIndex) in pack" :key="itemIndex">
            <span>{{ packIndex * 3 + itemIndex + 1 }}. </span
            ><span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class Timer extends Vue {
  getRequirements() {
    return [
      "Rozgrywka toczy się na planszy o wymiarach 5 na 6, składającej się z 30 jednakowych pól.",
      "Każdy gracz otrzymuje 12 jednakowych pionków.",
    ];
  }

  getRules() {
    const rules = [
      "Gracze rozpoczynają układając na przemian swoje pionki na planszy. Nazywamy to fazą układania.",
      "W tej fazie graczom nie wolno ułożyć 3 pionów swojego koloru w jednym rzędzie (w orientacji pionowo lub poziomo, rzędów po ukosie nie bierzemy pod uwagę).",
      "Po ułożeniu wszystkich 24 pionków, następuje druga część rozgrywki, mianowicie faza przesuwania.",
      "Gracze przesuwają swoje pionki na przemian.",
      "Ruchy mogą odbywać się o jedno pole w pionie poziomie, ale nie ukośnie.",
      "Gracz nie może wykonać ruchu polegającego na „cofnięciu pionka” w to samo miejsce, z którego się poruszył w poprzednim ruchu. Pionek może „wrócić” na poprzednio zajmowane pole tylko w przypadku wykonania nim w międzyczasie  innego ruchu (w praktyce przynajmniej trzech, jednocześnie przestrzegając pozostałych reguł).",
      "Gra polega na eliminowaniu pionków przeciwnika. ",
      "Usunięcie z planszy wybranego pionka rywala jest możliwe po ustawieniu trzech swoich pionków w rzędzie (czyli na kolejnych polach) poziomo lub pionowo. Ułożenie w jednym ruchu równocześnie trzech pionów w pionie i poziomie nie daje korzyści usunięcia dwóch pionów przeciwnika.",
      "Ułożenie czterech lub więcej pionków w rzędzie jest dozwolone, lecz nie daje ono korzyści w postaci usunięcia pionka rywala.",
      "Gra toczy się, dopóki któryś z graczy nie odbierze przeciwnikowi 10 pionków, co w efekcie uniemożliwi mu kontynuację rozgrywki. Opcjonalnie w przypadku braku możliwości wykonania ruchu przez którąś ze stron następuje remis.",
    ];
    let result = [],
      spacing = 3;
    for (var i = 0; i < rules.length; i += spacing) {
      result[result.length] = rules.slice(i, i + spacing);
    }
    return result;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.instructions {
  text-align: justify;
  display: flex;
  flex-direction: column;
  margin: 50px 300px;
}

header {
  font-size: 24px;
  border-top: 3px solid white;
  border-bottom: 3px solid white;
  text-align: center;
  padding: 2px 0 5px 0;
  margin: 0px 0 50px 0;
  display: inline-block;
}

.requirements {
  font-size: 24px;
  margin-bottom: 50px;
  border: 3px dashed white;
  position: relative;
  padding: 20px 25px 25px 25px;
  ul {
    list-style-position: inside;
    columns: 2;
    -webkit-columns: 2;
    -moz-columns: 2;
    li:not(:nth-child(even)) {
      margin-right: 15px;
    }
  }
}

.rules {
  font-size: 28px;
  width: 100%;
}

.rules-pack {
  position: relative;
  margin-bottom: 50px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: unset;
  padding: 20px 25px 25px 25px;
  border: 5px ridge white;
  ul {
    list-style-type: none;
    li:not(:last-child) {
      margin-bottom: 5px;
    }
  }
}

.rules-pack:before {
  z-index: 5;
  content: " ";
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border: 3px ridge white;
}

.rules-pack:nth-child(even) {
  margin-right: auto;
  margin-left: unset;
}
</style>
