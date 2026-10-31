package in.deliveryapp.dailygrocer.coreJava;

public class shop {
    private final String name;
    private boolean active;
    private final double deliveryRadiumKm;

    public shop(String name,boolean active, double deliveryRadiumKm){

        if(name==null || name.isBlank()){
            throw new IllegalArgumentException("Shop name could not be blank or empty.");
        }
        if(!Double.isFinite(deliveryRadiumKm) ||deliveryRadiumKm <=0){
            throw new IllegalArgumentException("Delivery Radius must be a positive finite number.");
        }

        this.name = name;
        this.deliveryRadiumKm = deliveryRadiumKm;
        this.active=active;
    }
    public boolean canDeliverTo(double distanceKm ){
        return active && distanceKm>=0 && distanceKm<=deliveryRadiumKm;
    }
    public void deactivate(){
        active=false;
    }

    public String getName(){
        return name;
    }
}
