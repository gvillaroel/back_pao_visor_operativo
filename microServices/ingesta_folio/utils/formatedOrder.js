exports.formatedOrder = (order, newFormated) => {

    const formated = newFormated;
    const orderOriginal = order;

    if (formated == '201') {
        const order201 = {
            Extn: {
              ExtnRegion: orderOriginal?.ExtnRegion ?? null,
              ExtnPaymentType: orderOriginal?.ExtnPaymentType ?? null,
              ExtnIsGiftPlusPurchase: orderOriginal?.ExtnIsGiftPlusPurchase ?? null,
              ExtnIsSelfAllocatedFromPOS: orderOriginal?.ExtnIsSelfAllocatedFromPOS ?? null,
              ExtnStoreNumber: orderOriginal?.ExtnStoreNumber ?? null,
              ExtnStoreSalesCredit: orderOriginal?.ExtnStoreSalesCredit ?? null,
              ExtnOrderType: orderOriginal?.ExtnOrderType ?? null,
              ExtnGREventId: orderOriginal?.ExtnGREventId ?? null,
              ExtnGREventName: orderOriginal?.ExtnGREventName ?? null,
              ExtnGROwnerName: orderOriginal?.ExtnGROwnerName ?? null,
              ExtnGRDeliveryDays: orderOriginal?.ExtnGRDeliveryDays ?? null,
              EDDHasChanged: orderOriginal?.EDDHasChanged ?? null,
              ExpectedDeliveryDate: orderOriginal?.ExpectedDeliveryDate ?? null,
              StatusOrder: orderOriginal?.OrderStatus ?? null,
            },
            SCAC: '',
            Status: orderOriginal?.OrderStatus ?? null,
            OrderNo: orderOriginal?.OrderNo ?? null,
            EntryType: orderOriginal?.EntryType ?? null,
            OrderDate: orderOriginal?.OrderDate ?? null,
            OrderName: orderOriginal?.OrderName ?? null,
            OrderType: orderOriginal?.OrderType ?? null,
            Containers: {
              Container: {
                TrackingNo: '',
                ContainerNo: '',
                ContainerDetails: {
                  ContainerDetail: [],
                },
              },
            },
            OrderLines: {
              OrderLine: orderOriginal?.OrderLines ? orderOriginal.OrderLines.map((linea) => {
                return {
                  Extn: {
                    ExtnIsExpedited: '',
                    ExtnLineType: '',
                    ExtnSpecialItem: linea?.Item?.ExtnSpecialItem ?? null,
                    ExtnNoSpotService: linea?.ExtnNoSpotService ?? null,
                    ExtnIsReturnPickup: linea?.Item?.ExtnIsReturnPickup ?? null,
                    ExtnCustomerDeliveryDate: linea?.ExtnCustomerDeliveryDate ?? null,
                  },
                  Item: {
                    ItemID: linea?.Item?.ItemID ?? null,
                    ImageURL: '',
                    ItemDesc: linea?.Item?.ItemDesc ?? null,
                    ProductClass: linea?.Item?.ProductClass ?? null,
                    UnitOfMeasure: linea?.Item?.UnitOfMeasure ?? null,
                  },
                  SCAC: '',
                  Status: linea?.OrderLineStatus ?? null,
                  LineType: linea?.LineType ?? null,
                  ShipNode: linea?.OrderLine?.ShipNode ?? null,
                  Shipments: {
                    Shipment: linea?.Shipments ? linea?.Shipments.map((shipment) => {
                        return {
                        Status: shipment?.Status ?? null,
                        StatusDescription: shipment?.StatusDescription ?? null,
                        ShipNode: shipment?.ShipNode ?? null,
                        ShipmentNo: shipment?.ShipmentNo ?? null,
                        DocumentType: '',
                        StatusDate: shipment?.StatusDate ?? null,
                        ShipmentLines: {
                            ShipmentLine: {
                            Quantity: '',
                            OrderLine: {
                                OrderedQty: '',
                            },
                            },
                        },
                        }
                    }) : [],
                  },
                  StoreDesc: '',
                  SubLineNo: linea?.OrderLine?.SubLineNo ?? null,
                  OrderedQty: linea?.OrderedQty ?? null,
                  References: {
                    Reference: (linea?.OrderLine?.References?.Reference?.length > 0)
                    ? linea.OrderLine.References.Reference.map(ref => ({
                        Name: ref?.Name ?? null,
                        Value: String(ref?.Value) ?? null,
                      }))
                    : [],
                  },
                  PrimeLineNo: linea?.PrimeLineNo ?? null,
                  OrderLineKey: linea?.OrderLineKey ?? null,
                  IsCancellable: linea?.IsCancellable ?? null,
                  MaxLineStatus: linea?.MaxLineStatus ?? null,
                  MinLineStatus: linea?.MinLineStatus ?? null,
                  DeliveryMethod: linea?.DeliveryMethod ?? null,
                  DepartmentCode: orderOriginal?.DepartmentCode ?? null,
                  OrderHeaderKey: linea?.OrderHeaderKey ?? null,
                  StatusQuantity: linea?.StatusQuantity ?? null,
                  FulfillmentType: orderOriginal?.FulfillmentType ?? null,
                  PersonInfoShipTo: {
                    City: orderOriginal?.PersonInfoShipTo?.City ?? null,
                    State: orderOriginal.PersonInfoShipTo?.State ?? null,
                    Title: orderOriginal?.PersonInfoShipTo?.Title ?? null,
                    Beeper: orderOriginal?.PersonInfoShipTo?.Beeper ?? null,
                    Suffix: '',
                    Company: orderOriginal?.PersonInfoShipTo?.Company ?? null,
                    Country: orderOriginal?.PersonInfoShipTo?.Country ?? null,
                    EMailID: orderOriginal?.PersonInfoShipTo?.EMailID ?? null,
                    HttpUrl: '',
                    ZipCode: orderOriginal?.PersonInfoShipTo?.ZipCode ?? null,
                    DayFaxNo: orderOriginal?.PersonInfoShipTo?.DayFaxNo ?? null,
                    DayPhone: orderOriginal?.PersonInfoShipTo?.DayPhone ?? null,
                    ErrorTxt: orderOriginal?.PersonInfoShipTo?.ErrorTxt ?? null,
                    JobTitle: orderOriginal?.PersonInfoShipTo?.JobTitle ?? null,
                    LastName: orderOriginal?.PersonInfoShipTo?.LastName ?? null,
                    PersonID: orderOriginal?.PersonInfoShipTo?.PersonID ?? null,
                    UseCount: '',
                    FirstName: orderOriginal?.PersonInfoShipTo?.FirstName ?? null,
                    Department: orderOriginal?.PersonInfoShipTo?.Department ?? null,
                    MiddleName: orderOriginal?.PersonInfoShipTo?.MiddleName ?? null,
                    OtherPhone: orderOriginal?.PersonInfoShipTo?.OtherPhone ?? null,
                    MobilePhone: orderOriginal?.PersonInfoShipTo?.MobilePhone ?? null,
                    AddressLine1: orderOriginal?.PersonInfoShipTo?.AddressLine1 ?? null,
                    AddressLine2: orderOriginal?.PersonInfoShipTo?.AddressLine2 ?? null,
                    AddressLine3: orderOriginal?.PersonInfoShipTo?.AddressLine3 ?? null,
                    AddressLine4: orderOriginal?.PersonInfoShipTo?.AddressLine4 ?? null,
                    AddressLine5: orderOriginal?.PersonInfoShipTo?.AddressLine5 ?? null,
                    AddressLine6: orderOriginal?.PersonInfoShipTo?.AddressLine6 ?? null,
                    EveningFaxNo: orderOriginal?.PersonInfoShipTo?.EveningFaxNo ?? null,
                    EveningPhone: orderOriginal?.PersonInfoShipTo?.EveningPhone ?? null,
                    PersonInfoKey: orderOriginal?.PersonInfoShipTo.PersonInfoKey ?? null,
                    AlternateEmailID: orderOriginal?.PersonInfoShipTo?.AlternateEmailID ?? null,
                    VerificationStatus: '',
                    PreferredShipAddress: orderOriginal?.PersonInfoShipTo?.PreferredShipAddress ?? null,
                  },
                  MaxLineStatusDesc: linea?.MaxLineStatusDesc ?? null,
                  MaxShipmentStatus: linea?.MaxShipmentStatus ?? null,
                  MinLineStatusDesc: linea?.MinLineStatusDesc ?? null,
                  MinShipmentStatus: '',
                  OriginalOrderedQty: linea?.OriginalOrderedQty ?? null,
                  AdditionalAddresses: {},
                  MaxShipmentStatusDesc: '',
                  MinShipmentStatusDesc: '',
      
                }
              }) : [],
            },
            References: {
              Reference: [
                  {
                      Name: "ExtnEnterpriseCode",
                      Value: orderOriginal?.ExtnEnterpriseCode ?? null
                  },
                  {
                      Name: "ExtnPaymentType",
                      Value: orderOriginal?.ExtnPaymentType ?? null
                  },
                  {
                      Name: "ExtnEmployeeNumber",
                      Value: orderOriginal?.ExtnEmployeeNumber ?? null
                  },
                  {
                      Name: "ExtnTicketNumber",
                      Value: orderOriginal?.ExtnTicketNumber ?? null
                  },
                  {
                      Name: "ExtnRegion",
                      Value: orderOriginal?.ExtnRegion ?? null
                  },
                  {
                      Name: "ExtnStoreSalesCredit",
                      Value: orderOriginal?.ExtnStoreSalesCredit ?? null
                  },
                  {
                      Name: "ExtnStoreNumber",
                      Value: orderOriginal?.ExtnStoreNumber ?? null
                  },
                  {
                      Name: "BillToID",
                      Value: orderOriginal?.BillToID ?? null
                  },
                  {
                      Name: "ExtnComments",
                      Value: orderOriginal?.ExtnComments ?? null
                  },
                  {
                      Name: "ExtnNoCancel",
                      Value: orderOriginal?.ExtnNoCancel ?? null
                  },
              ]
            },
            IsDuplicate: null,
            MessageType: orderOriginal?.MessageType ?? null,
            StatusOrder: orderOriginal?.OrderStatus ?? null,
            DocumentType: orderOriginal?.DocumentType ?? null,
            EnterpriseCode: orderOriginal?.EnterpriseCode ?? null,
            MaxOrderStatus: orderOriginal?.MaxOrderStatus ?? null,
            MinOrderStatus: orderOriginal?.MinOrderStatus ?? null,
            CustomerEMailID: orderOriginal?.CustomerEmailId ?? null,
            StatusTimeStamp: orderOriginal?.StatusTimeStamp ?? null,
            MaxOrderStatusDesc: orderOriginal?.MaxLineStatusDesc ?? null,
            MinOrderStatusDesc: orderOriginal?.MinOrderStatusDesc ?? null,
            SellerOrganizationCode: orderOriginal?.SellerOrganizationCode ?? null,
        }
        return {Order: order201}
    }
    return null
}