/**
 * Created by user on 2016/2/7.
 */


//BaseTile.java
var Basetile={
    createNew:function(){
        var tile={}
        tile.temperature=0;
        tile.setTemperature=function(newTemperature) {
            this.temperature = newTemperature;
        }
        tile.updateTempurature=function(recWorld,x,z){
            var dT=0-this.temperature;
            if(dT!=0){
                var d=64;
                var diff=(1+dT/d);
                if (diff<=1)diff=dT/Math.abs(dT);
                this.temperature+=diff;
            }
            for (var i=0;i<=6;i++){
                var dir = dirs[i];
                var dx = x + dir.offsetX;
                var dy = dir.offsetY;
                var dz = z + dir.offsetZ;
                var block = recWorld.getBlock(dx, dy, dz);
                var te = recWorld.getTileEntity(dx, dy, dz);
                if (block != null && te.hasOwnProperty("temperature")) {

                    var bt = te;

                    var T = bt.temperature;
                    dT = T - this.temperature;
                    if (dT > 0) {
                        var newT = T - dT / 4;
                        this.temperature += dT / 4;
                        bt.setTemperature(newT);
                    }

                }
            }
        }

        return tile;
    }
}
//RecWorld.java
var RecWorld={
    createNew:function(){
        var recworld={}
        recworld.worldTick=0;
        recworld.steam=0;
        recworld.isRemote=false;
        recworld.coreCount=0;
        recworld.tiles=null;
        recworld.world=null;
        recworld.doTick=function(){
            for(var te in this.tileArray){
                te.update(this, te.getX(), te.getZ());
            }
        }
        recworld.checkCoord=function(x, z) {
            if (x < 0 || z < 0) {
                return false;
            }
            if (x >= 32) {
                return false;
            }
            if (z >= 32) {
                return false;
            }
            return true;
        }
        recworld.getBlock=function(x,y,z){
            if (y != 0) {
                return null;//block.air -> null
            }
            if (!checkCoord(x, z)) {
                return null;//block.air -> null
            }
            var b = this.world[x][z];
            if(b == null)
            {
                return null;//block.air -> null
            }else
            {
                return b;
            }
        }
        recworld.getBlockMetadata=function(x,y,z){return 0}
        recworld.getTileEntity=function(x,y,z) {
            if (y != 0) {
                return null;
            }
            if (!checkCoord(x, z)) {
                return null;
            }
            return this.tiles[x][z];

        }
        recworld.setBlock=function(t,x,z){
            if (this.checkCoord(x,z)){
                var b= Block.createNew();
                b.type=t;
                recworld.world[x][z]=b;
                switch (t){
                    case Block.Type.CORE:
                    case Block.Type.BOILER:
                    case Block.Type.REFLECTOR:
                        break;//todo FILL THIS
                }
            }
        }

        return recworld;
    }
}
//Block.java
var Block={
    Type:{
        AIR:0, NORMAL:1, WATER:2, STEEL:3, CONCRETE:4, BEDINGOT:5, LEAD:6, OBSIDIAN:7, CORE:8, BOILER:9, REFLECTOR:10
    },
    createNew:function(){
        var block={};
        block.hasTileEntity=function(meta){
            switch (this.type) {
                case Block.Type.CORE:
                case Block.Type.BOILER:
                case Block.Type.REFLECTOR:
                    return true;
                default:
                    return false;
            }
        }
        block.isNeutronShield=function(){
            switch (this.type) {
                case Block.Type.WATER:
                case Block.Type.STEEL:
                case Block.Type.CONCRETE:
                case Block.Type.BEDINGOT:
                case Block.Type.LEAD:
                case Block.Type.OBSIDIAN:
                    return true;
                default:
                    return false;
            }
        }
        block.getAbsorptionChance=function(t){
            switch(this.type)
            {
                case Block.Type.WATER:
                    return 30;
                case Block.Type.STEEL:
                    return 100;
                case Block.Type.CONCRETE:
                    return 60;
                case Block.Type.BEDINGOT:
                    return 97.5;
                case Block.Type.LEAD:
                    return 75;
                case Block.Type.OBSIDIAN:
                    return 50;
                default :
                    return 0;
            }
        }
        return block;
    }
}
//ForgeDirection.java
function createNewDir(x, y, z){
    var dir={}
    dir.offsetX = x;
    dir.offsetY = y;
    dir.offsetZ = z;
    dir.getOpposite=function(){
        switch (this){
            case ForgeDirection.UP:return ForgeDirection.DOWN;
            case ForgeDirection.DOWN:return ForgeDirection.UP;
            case ForgeDirection.NORTH:return ForgeDirection.SOUTH;
            case ForgeDirection.SOUTH:return ForgeDirection.NORTH;
            case ForgeDirection.WEST:return ForgeDirection.EAST;
            case ForgeDirection.EAST:return ForgeDirection.WEST;
        }
    }
    return dir;
}
var ForgeDirection={
    DOWN:createNewDir(0,-1,0),
    UP:createNewDir(0,1,0),
    NORTH:createNewDir(0,0,-1),
    SOUTH:createNewDir(0,0,1),
    WEST:createNewDir(-1,0,0),
    EAST:createNewDir(1,0,0)
}
var ForgeDirections=[ForgeDirection.DOWN,ForgeDirection.UP,
    ForgeDirection.NORTH,ForgeDirection.SOUTH,
    ForgeDirection.WEST,ForgeDirection.EAST];




