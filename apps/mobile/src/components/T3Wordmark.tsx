import type { ColorValue } from "react-native";
import Svg, { Path } from "react-native-svg";

/** The compact Pearce Codes monogram used in native navigation bars. */
export function T3Wordmark(props: { readonly height: number; readonly color: ColorValue }) {
  const aspectRatio = 1.58;
  return (
    <Svg
      accessibilityLabel="PC"
      height={props.height}
      width={props.height * aspectRatio}
      viewBox="-25 -10 1100 700"
    >
      <Path
        d="M100 0V680Q113 683 144 684Q175 685 209 685.5Q243 686 264 686Q353 686 407 676Q461 666 489.5 641.5Q518 617 528 573Q538 529 538 460Q538 397 527.5 356.5Q517 316 490.5 293.5Q464 271 416 262.5Q368 254 293 254H218V0ZM218 363H284Q340 363 369.5 371.5Q399 380 409.5 402Q420 424 420 466Q420 512 408 535.5Q396 559 363 568Q330 577 267 577H218ZM954 179H1072Q1067 121 1055 84Q1043 47 1018.5 26.5Q994 6 951.5 -2Q909 -10 844 -10Q769 -10 721.5 4.5Q674 19 648 57Q622 95 611.5 163.5Q601 232 601 340Q601 443 612.5 511Q624 579 651 618Q678 657 725 673.5Q772 690 844 690Q908 690 949 682Q990 674 1014 653Q1038 632 1050 594Q1062 556 1066 497H948Q942 532 931.5 550.5Q921 569 901 575.5Q881 582 844 582Q795 582 768.5 563Q742 544 732.5 492.5Q723 441 723 342Q723 242 732.5 189.5Q742 137 768.5 117.5Q795 98 844 98Q884 98 906 104.5Q928 111 938.5 128.5Q949 146 954 179Z"
        fill={props.color}
        stroke={props.color}
        strokeLinejoin="round"
        strokeWidth={18}
        transform="skewX(-10)"
      />
    </Svg>
  );
}
