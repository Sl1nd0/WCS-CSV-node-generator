var json2csv = require('json2csv');
var fs_csv = require('fs');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var mongooseSchema = mongoose.Schema // MongoDB Schema class object.

var pickListMongoSchema = mongooseSchema({
    toteID: { type: String, default: null },
    transporterID: { type: String, default: null },
    destination: { type: String, default: null },
    containerLocation: { type: String, default: null },
    packType: { type: String, default: null },
    toteInUse: { type: Boolean, default: false },
    toteInUseBy: { type: String, default: null },
    orders: [{
        orderID: { type: String, default: null },
        cartonID: { type: String, default: null },
        toteNumber: { type: Number, default: null },
        numberOfTotes: { type: Number, default: 0 },
        pickListID: { type: String, default: null },
        courierID: { type: String, default: null },
        orderType: { type: String, default: null },
        priorityLevel: { type: String, default: null },
        picklistWeight: { type: Number, default: null },
        picklistVolume: { type: Number, default: null },
        picked: { type: Boolean, default: false },
        packed: { type: Boolean, default: false },
        shipped: { type: Boolean, default: false },
        rejected: { type: Boolean, default: false },
        rejectedReason: { type: String, default: null },
        cartonSize: { type: Number, default: -1 },
        printed: { type: Boolean, default: false },
        orderVerified: { type: Boolean, default: false },
        packComplete: { type: Boolean, default: false },
        useTransporter: { type: Boolean, default: false },
        transporterID: { type: String, default: null },
        transporterWeight: { type: Number, default: null },
        actualWeight2: { type: Number, default: null },
        actualWeight1: { type: Number, default: null },
        maxWeightLimit: { type: Number, default: null },
        minWeightLimit: { type: Number, default: null },
        WmsOrderStatus: { type: String, default: null },
        WmsPickListStatus: { type: String, default: null },
        WmsSerialsUpdated: { type: Boolean, default: false },
        items: [{
            itemCode: { type: String, default: null },
            itemDescription: { type: String, default: null },
            eachWeight: { type: Number, default: null },
            qty: { type: Number, default: null },
            pickQty: { type: Number, default: null },
            qtyPacked: { type: Number, default: null },
            location: { type: String, default: null },
            pickZone: { type: String, default: null },
            picked: { type: Boolean, default: false },
            packed: { type: Boolean, default: false },
            shortPick: { type: Boolean, default: false },
            serials: [],
            barcode: { type: String, default: null },
            sku: { type: String, default: null },
            serialised: { type: Boolean, default: false },
            pickedBy: { type: String, default: null },
            packedBy: { type: String, default: null },
            qtyPacked: {type: Number, default: null},
            unitPrice: { type: Number, default: null },
            uom: { type: String, default: null },
            orderLine: { type: Number, default: null },
            pickListOrderLine: { type: Number, default: null },
            eachVolume: { type: Number, default: null },
            WmsCartonLineStatus: { type: String, default: null },
            PickLineRequired: { type: Boolean, default: false }
        }]
    }],
    PackedDate: { type: String, default: null },
    Status: { type: String, default: null },
    FromTote: { type: String, default: null },
    PickUpdateRequired: { type: Boolean, default: false },
    PackUpdateRequired: { type: Boolean, default: false },
    ShipUpdateRequired: { type: Boolean, default: false },
    CreateDate: { type: String, default: null },
    PickListType: { type: String, default: null },
    PickType: { type: String, default: null },
    PickRegion: { type: String, default: null }
})

var pickList = mongoose.model('pickList', pickListMongoSchema)

mongoose.connect('mongodb://10.211.110.131/MTNWCS', function(err) {
    if (err) {
        console.log('MONGO CONNECT ERROR ' + err);
    } else {
        console.log('CONNECTED TO MONGODB');
        getOrders(process.argv);
    }
});

function getOrders(CartonArr) {
    var Arr = [];

    var ndx = 2;
    while (ndx < CartonArr.length) {
        Arr.push(CartonArr[ndx]);
        ndx++;
    }

    console.log('My List: ' + Arr);
    now = new Date();

    // var pickLists = ["P000421152",
    //     "P000421153",
    //     "P000421153",
    //     "P000421154",
    //     "P000421154",
    //     "P000422015",
    //     "P000422015",
    //     "P000422016",
    //     "P000422016",
    //     "P000422012",
    //     "P000422012",
    //     "P000421162",
    //     "P000421162",
    //     "P000421163",
    //     "P000421163",
    //     "P000421164",
    //     "P000421164",
    //     "P000422163",
    //     "P000422163",
    //     "P000422164",
    //     "P000422164",
    //     "P000422165",
    //     "P000422165",
    //     "P000422062",
    //     "P000422062",
    //     "P000422063",
    //     "P000422063",
    //     "P000422064",
    //     "P000422064",
    //     "P000421212",
    //     "P000421212",
    //     "P000421026",
    //     "P000421026",
    //     "P000421027",
    //     "P000421027"
    // ];

    // var param = pickLists;

    var JobData = [];
    var JobData1 = [];
    pickList.find({
        //'orders.rejected': true,
      /* 'orders.orderID': {$in : ['2010805_1',
        '2083393_1',
        '2085827_1',
        '2099041_1',
        '2100037_1',
        '2098175_1',
        '2098855_1',
        '2098837_1',
        '2098834_1',
        '2098840_1',
        '2098846_1',
        '2098844_1',
        '2098835_1',
        '2098849_1',
        '2098851_1',
        '2099051_1',
        '2098571_1',
        '2098831_1',
        '2102552_1',
        '2085090_1',
        '2098989_1',
        '2097061_1',
        '2102144_1',
        '2100361_1',
        '2085595_1',
        '2096884_1',
        '2099997_1']}, 'orders.items.qtyPacked' : {$ne : 0} */
       // $and: [{'orders.actualWeight2': {$ne : null}}, {'orders.actualWeight1' : null}, {'Status':'SHIPPED'}, {'dispatched': true}, {'orders.WmsPickListStatus' : 'COMPLETE'}, {'CreateDate' : {$gte : '2019-01-01'}}]
       //$and: [{'Status':'SHIPPED'}, {'orders.WmsPickListStatus' : 'COMPLETE'}, {'PackedDate' : {$gte : '2019-01-01'}}]

      'PackedDate':/2019-07-29/, 'dispatched' : false, 'Status' : 'SHIPPED'

    }, function(err, PL) {
        if (err || !PL || PL.length <= 0) {
            console.log('Nothing')
        } else {
            var x = 0;
            while (x < PL.length) {
                var y = 0;
                while (y < PL[x].orders.length) {
                    var z = 0;

                    var data1 = {
                        orderID: PL[x].orders[y].orderID,
                        // PickType: 'PARTIAL',
                        // PickMethod: 'PBO',
                        // StrategyID: 'PTL',
                        CreateDate: PL[x].CreateDate,
                        // PlanDate: null,
                        // ReleaseDate: null,
                        // AssignedDate: null,
                        // CompletedDate: null,
                        //Status: PL[x].Status,
                        Serial: PL[x].orders[y].items[z].serial,
                        PicklistID:PL[x].orders[y].pickListID,
                        CartonNumber: PL[x].orders[y].toteNumber,
                        TotalNumberOfCartons: PL[x].orders[y].numberOfTotes,
                        cartonID: PL[x].orders[y].cartonID,
                        Weight1:PL[x].orders[y].actualWeight1,
                        Weight2:PL[x].orders[y].actualWeight2,
                        MaxWeight:PL[x].orders[y].maxWeightLimit,
                        MinWeight:PL[x].orders[y].minWeightLimit,
                        //Location:PL[x].orders[y].items[z].location,
                        Status:PL[x].Status,
                        Packdate:PL[x].PackedDate,

                        //PackedQTY: PL[x].qtyPacked
                        // Wave: null,
                        // HUType: 'Tote',
                        // AddDate: null,
                        // AddUser: 'SYSTEM',
                        // EditDate: null,
                        // EditUser: 'SYSTEM'
                        // Serials: PL[x].orders[y].items[z].serials,

                    }

                    JobData1.push(data1);

                    while (z < PL[x].orders[y].items.length) {
                        var data = {
                            orderID: PL[x].orders[y].orderID,
                            // PickType: 'PARTIAL',
                            // PickMethod: 'PBO',
                            // StrategyID: 'PTL',
                            CreateDate: PL[x].CreateDate,
                            // PlanDate: null,
                            // ReleaseDate: null,
                            // AssignedDate: null,
                            // CompletedDate: null,
                            //Status: PL[x].Status,
                            Serial: PL[x].orders[y].items[z].serials,
                            PicklistID:PL[x].orders[y].pickListID,
                            CartonNumber: PL[x].orders[y].toteNumber,
                            TotalNumberOfCartons: PL[x].orders[y].numberOfTotes,
                            cartonID: PL[x].orders[y].cartonID,
                            Weight1:PL[x].orders[y].actualWeight1,
                            Weight2:PL[x].orders[y].actualWeight2,
                            MaxWeight:PL[x].orders[y].maxWeightLimit,
                            MinWeight:PL[x].orders[y].minWeightLimit,
                            //Location:PL[x].orders[y].items[z].location,
                            Status:PL[x].Status,
                            Packdate:PL[x].PackedDate,
    
                            PackedQTY: PL[x].orders[y].items[z].qtyPacked
                            // Wave: null,
                            // HUType: 'Tote',
                            // AddDate: null,
                            // AddUser: 'SYSTEM',
                            // EditDate: null,
                            // EditUser: 'SYSTEM'
                            // Serials: PL[x].orders[y].items[z].serials,
                        }



                        z++;
                        JobData.push(data);

                    }


                    y++;
                }
                x++;
            }

            if (JobData.length > 0) {
                var csv = json2csv({ data: JobData });
                var csv1 = json2csv({ data: JobData1 });

                fs_csv.writeFile('PickListDetail.csv', csv, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Done');//

                        fs_csv.writeFile('PickListHeader.csv', csv1, function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Done');
                            }
                        });
                    }
                });


            }
        }
    });
}

function getOrders1() {
    var JobData = [];
    pickList.find({ 'orders.WmsOrderStatus': 'NEW' }, function(err, PL) {
        if (err || !PL || PL.length <= 0) {
            console.log('Nothing')
        } else {
            var x = 0;
            while (x < PL.length) {
                var y = 0;
                while (y < PL[x].orders.length) {
                    if (PL[x].orders[y].WmsOrderStatus == 'NEW') {
                        var data = {
                            OrderID: PL[x].orders[y].orderID,
                            WMSSTATUS: PL[x].orders[y].WmsOrderStatus
                        }
                        JobData.push(data);
                    }
                    y++;
                }
                x++
            }

            if (JobData.length > 0) {
                var csv = json2csv({ data: JobData });

                fs_csv.writeFile('Lung.csv', csv, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Done');
                    }
                });
            }
        }
    });
}