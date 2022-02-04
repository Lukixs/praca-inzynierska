<template>
  <div class="instructions">
    <ul class="rules">
      <li v-for="(item, index) in getRules()" :key="index">
        <span>{{ index + 1 }}. </span><span>{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class Timer extends Vue {
  mounted() {
    console.log("XD");
  }

  getRules() {
    return [
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.instructions {
  display: flex;
  max-width: 800px;
  text-align: left;
  margin: 50px auto;
}

.rules {
  font-size: 24px;
}
</style>
