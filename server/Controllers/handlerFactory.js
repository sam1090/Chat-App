// const asyncHandler = require('async-handler-express');
// // exports.deleteOne = (Model) =>
// //   catchAsync(async (req, res, next) => {
// //     const doc = await Model.findByIdAndDelete(req.params.id);

// //     if (!doc) {
// //       return next(new AppError('No document is found with that ID', 404));
// //     }

// //     res.status(204).json({
// //       status: 'success',
// //       data: null,
// //     });
// //   });

// // exports.updateOne = (Model) =>
// //   catchAsync(async (req, res, next) => {
// //     const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
// //       new: true,
// //       runValidators: true,
// //     });

// //     if (!doc) {
// //       return next(new AppError('No document found with that ID', 404));
// //     }

// //     res.status(200).json({
// //       status: 'success',
// //       data: {
// //         data: doc,
// //       },
// //     });
// //   });

// // exports.createOne = (Model) =>
// //   catchAsync(async (req, res, next) => {
// //     const newDoc = await Model.create(req.body);

// //     res.status(201).json({
// //       status: 'success',
// //       data: {
// //         data: newDoc,
// //       },
// //     });
// //   });

// exports.getOne = (Model, popOptions) =>
//   (async (req, res, next) => {
//     try{
//     const doc = await Model.findById(req.params.id).populate(popOptions);
//     // Tour.findOne({ _id: req.params.id })

//     if (!doc) {
//       return next(new Error('No document found with that ID', 404));
//     }

//     res.status(200).json({
//       status: 'success',
//       data: {
//         doc,
//       },
//     });
//   }catch(error){
//     throw new Error(error);
//   }});


// exports.getAll = (Model) =>
//   (async (req, res, next) => {
//     try{

      

//     // SEND RESPONSE
//     res.status(200).json({
//       status: 'success',
//       results: doc.length,
//       data: {
//         doc,
//       },
//     });}
//     catch(error){
//       throw new Error(error);
//     }
//   });
