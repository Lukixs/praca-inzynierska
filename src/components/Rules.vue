<template>
  <div class="instructions">
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
  mounted() {
    console.log(this.getRules());
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
      "Gra toczy się, dopóki któryś z graczy nie odbierze przeciwnikowi 10 pionków, co w efekcie uniemożliwi mu kontynuację rozgrywki. Opcjonalnie w przypadku braku możliwości wykonania ruchu przez którąś ze stron następuje remis.",
      "Gra toczy się, dopóki któryś z graczy nie odbierze przeciwnikowi 10 pionków, co w efekcie uniemożliwi mu kontynuację rozgrywki. Opcjonalnie w przypadku braku możliwości wykonania ruchu przez którąś ze stron następuje remis.",
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
  display: flex;
  text-align: left;
  margin: 50px 300px;
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
  padding: 20px 25px 25px 45px;
  border: 5px solid white;
  z-index: 10;
}

.rules-pack:before {
  z-index: 5;
  content: " ";
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border: 3px solid white;
}

.rules-pack:nth-child(even) {
  margin-right: auto;
  margin-left: unset;
}
</style>
