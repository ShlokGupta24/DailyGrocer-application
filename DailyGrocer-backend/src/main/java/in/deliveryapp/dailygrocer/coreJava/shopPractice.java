package in.deliveryapp.dailygrocer.coreJava;

public class shopPractice {
    public static void main(String[] args) {

    shop sp1 =new shop("Fresh Mark", true,1.0);

        System.out.println(sp1.getName());
        System.out.println(sp1.canDeliverTo(2.0));
        System.out.println(sp1.canDeliverTo(6.0));
        sp1.deactivate();
        System.out.println(sp1.canDeliverTo(-1.0));

        shop sp2 =new shop("Express Mark", true,4.0);

        System.out.println(sp2.getName());
        System.out.println(sp2.canDeliverTo(2.0));
        System.out.println(sp2.canDeliverTo(6.0));
        sp2.deactivate();
        System.out.println(sp2.canDeliverTo(1.0));
    }
}
