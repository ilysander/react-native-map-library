#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(MapLibrary, NSObject)

RCT_EXTERN_METHOD(addMarker: (double)latitude longitude:(double)longitude title:(NSString *)title snippet:(NSString *)snippet resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end

@interface RCT_EXTERN_MODULE(RCTMapViewManager, RCTViewManager)
@end
